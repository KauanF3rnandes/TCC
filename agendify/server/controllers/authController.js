const db = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10;
const SECRET_KEY = 'f14tomcat';

const register = (req, res) => {
    const { email, nome, senha, telefone, empresaId } = req.body; 

    db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error("Erro ao verificar o e-mail:", err);
            return res.status(500).send("Erro ao registrar usuário");
        }

        if (result.length > 0) {
            return res.status(400).send("E-mail já registrado");
        }

        bcrypt.hash(senha, saltRounds, (err, hash) => {
            if (err) {
                console.error("Erro ao gerar hash da senha:", err);
                return res.status(500).send("Erro ao registrar usuário");
            }

            db.query("INSERT INTO usuarios (email, nome, senha, telefone, empresaId) VALUES (?, ?, ?, ?, ?)", [email, nome, hash, telefone, empresaId], 
                (err, response) => {
                    if (err) {
                        console.error("Erro ao registrar usuário:", err);
                        return res.status(500).send("Erro ao registrar usuário");
                    }
                    console.log("Usuário registrado com sucesso");
                    res.send("Usuário registrado com sucesso");
                }
            );
        });
    });
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).send({ success: false, msg: "Email e senha são obrigatórios" });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM usuarios WHERE email = ?", [email], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log("Resultado da busca por usuário:", result);

        if (result.length === 0) {
            console.log("Conta não encontrada para o email:", email);
            return res.status(404).send({ success: false, msg: "Conta não encontrada" });
        }

        const user = result[0];

        if (!user.Senha) {
            console.log("Senha no banco de dados é inválida ou não fornecida");
            return res.status(400).send({ success: false, msg: "Senha inválida no banco de dados" });
        }

        const match = await bcrypt.compare(senha, user.Senha);

        if (match) {
            const userType = user.TipoUsuario.toLowerCase();
            const userData = {
                id: user.UsuarioID,
                nome: user.Nome,
                email: user.Email,
                tipoUsuario: userType,
            };

            const token = jwt.sign({ id: user.UsuarioID, role: user.TipoUsuario }, SECRET_KEY, { expiresIn: '1h' });
            return res.send({ success: true, msg: "Usuário logado com sucesso", token, user: userData });
        } else {
            console.log("Senha incorreta para o email:", email);
            return res.status(401).send({ success: false, msg: "Senha incorreta" });
        }
    } catch (err) {
        console.error("Erro ao processar login:", err);
        return res.status(500).send({ success: false, error: "Erro ao processar login" });
    }
};


const cadastro_empresa = (req, res) => {
    const { empresa, email, telefone, cnpj } = req.body;

    db.query("SELECT * FROM empresas WHERE email = ?", [email], (err, result) => {
        if (err) {
            console.error("Erro ao verificar o e-mail:", err);
            return res.status(500).send("Erro ao verificar e-mail");
        }

        if (result.length > 0) {
            return res.status(400).send("E-mail já registrado");
        }

        db.query("INSERT INTO empresas (nome, email, telefone, cnpj) VALUES (?, ?, ?, ?)", [empresa, email, telefone, cnpj], 
            (err, response) => {
                if (err) {
                    console.error("Erro ao registrar empresa:", err);
                    return res.status(500).send("Erro ao registrar empresa");
                }
                console.log("Empresa registrada com sucesso");
                res.send("Empresa registrada com sucesso");
            }
        );
    });
};

const verifyJWT = (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(403).send('No token provided');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(500).send('Failed to authenticate token');
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
};

const roleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.userRole === role) {
            next();
        } else {
            res.status(403).send('Access denied');
        }
    };
};

const listarEmpresas = (req, res) => {
    db.query("SELECT * FROM empresas", (err, result) => {
        if (err) {
            console.error("Erro ao buscar empresas:", err);
            return res.status(500).send("Erro ao buscar empresas");
        }
        res.send(result);
    });
};

const cadastrarHorario = (req, res) => {
    const { empresaId, data, horario } = req.body;

    if (!empresaId || !data || !horario) {
        return res.status(400).send("Todos os campos são obrigatórios");
    }

    db.query("INSERT INTO Horarios (EmpresaID, Data, Horario) VALUES (?, ?, ?)", [empresaId, data, horario], 
        (err, response) => {
            if (err) {
                console.error("Erro ao cadastrar horário:", err);
                return res.status(500).send("Erro ao cadastrar horário");
            }
            console.log("Horário cadastrado com sucesso");
            res.send("Horário cadastrado com sucesso");
        }
    );
};

const listarHorariosDisponiveis = (req, res) => {
    const { empresaId, data } = req.query;

    if (!empresaId || !data) {
        return res.status(400).send("EmpresaID e Data são obrigatórios");
    }

    db.query("SELECT Horario FROM Horarios WHERE EmpresaID = ? AND Data = ?", [empresaId, data], (err, result) => {
        if (err) {
            console.error("Erro ao buscar horários:", err);
            return res.status(500).send("Erro ao buscar horários");
        }
        res.send(result);
    });
};

const deletarHorario = (req, res) => {
    const horarioId = req.params.horarioId;

    db.query("DELETE FROM Horarios WHERE HorarioID = ?", [horarioId], (err, result) => {
        if (err) {
            console.error("Erro ao deletar horário:", err);
            return res.status(500).send("Erro ao deletar horário");
        }
        console.log("Horário deletado com sucesso");
        res.send("Horário deletado com sucesso");
    });
};

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const result = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM usuarios WHERE UsuarioID = ?", [userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        if (result.length === 0) {
            return res.status(404).send({ success: false, msg: "Usuário não encontrado" });
        }

        const user = result[0];
        const userData = {
            id: user.UsuarioID,
            nome: user.Nome,
            email: user.Email,
            tipoUsuario: user.TipoUsuario,
        };

        res.send({ success: true, user: userData });
    } catch (err) {
        console.error("Erro ao buscar usuário:", err);
        return res.status(500).send({ success: false, error: "Erro ao buscar usuário" });
    }
};

const registrarAgendamento = (req, res) => {
    const { usuarioId, empresaId, data, horario } = req.body;

    console.log("Dados recebidos para agendamento:", { usuarioId, empresaId, data, horario });

    if (!usuarioId || !empresaId || !data || !horario) {
        console.error("Erro: Todos os campos são obrigatórios");
        return res.status(400).send("Todos os campos são obrigatórios");
    }

    db.query("SELECT HorarioID FROM Horarios WHERE Horario = ?", [horario], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar o ID do horário:", err);
            return res.status(500).send("Erro ao buscar o ID do horário");
        }
        
        if (rows.length === 0) {
            console.error("Horário não encontrado no banco de dados");
            return res.status(404).send("Horário não encontrado no banco de dados");
        }

        const horarioId = rows[0].HorarioID;

        db.query("INSERT INTO Agendamentos (UsuarioID, EmpresaID, DataAgendamento, HorarioID) VALUES (?, ?, ?, ?)", 
        [usuarioId, empresaId, data, horarioId], 
        (err, response) => {
            if (err) {
                console.error("Erro ao registrar agendamento:", err);
                return res.status(500).send("Erro ao registrar agendamento");
            }
            console.log("Agendamento registrado com sucesso");
            res.send("Agendamento registrado com sucesso");
        });
    });
};

const listarAgendamentos = (req, res) => {
    const usuarioId = req.userId;

    db.query("SELECT a.DataAgendamento, u.nome AS Usuario, e.nome AS Empresa, h.Horario, a.Status FROM Agendamentos a JOIN usuarios u ON a.UsuarioID = u.UsuarioID JOIN empresas e ON a.EmpresaID = e.EmpresaID JOIN horarios h ON a.HorarioID = h.HorarioID WHERE a.UsuarioID = ?", [usuarioId], (err, result) => {
        if (err) {
            console.error("Erro ao buscar agendamentos:", err);
            return res.status(500).send("Erro ao buscar agendamentos");
        }
        res.send(result);
    });
};

const deletarAgendamento = (req, res) => {
    const agendamentoId = req.params.agendamentoId;

    db.query("DELETE FROM Agendamentos WHERE AgendamentoID = ?", [agendamentoId], (err, result) => {
        if (err) {
            console.error("Erro ao deletar agendamento:", err);
            return res.status(500).send("Erro ao deletar agendamento");
        }
        console.log("Agendamento deletado com sucesso");
        res.send("Agendamento deletado com sucesso");
    });
};


const listarHorariosDaEmpresa = async (req, res) => {
    const userId = req.userId;

    try {
        const userResult = await new Promise((resolve, reject) => {
            db.query("SELECT EmpresaID FROM usuarios WHERE UsuarioID = ?", [userId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log("Resultado da consulta do usuário:", userResult);

        if (userResult.length === 0) {
            return res.status(404).send({ success: false, msg: "Usuário não encontrado" });
        }

        const empresaId = userResult[0].EmpresaID;

        const horariosResult = await new Promise((resolve, reject) => {
            db.query("SELECT * FROM Horarios WHERE EmpresaID = ?", [empresaId], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        console.log("Horários encontrados:", horariosResult);

        res.send(horariosResult);
    } catch (err) {
        console.error("Erro ao buscar horários da empresa:", err);
        res.status(500).send({ success: false, error: "Erro ao buscar horários da empresa" });
    }
};

const listarEmpresaUsuarioLogado = (req, res) => {
    const userId = req.userId;

    db.query("SELECT e.* FROM empresas e JOIN usuarios u ON e.EmpresaID = u.EmpresaID WHERE u.UsuarioID = ?", [userId], (err, result) => {
        if (err) {
            console.error("Erro ao buscar empresa do usuário:", err);
            return res.status(500).send("Erro ao buscar empresa do usuário");
        }
        if (result.length === 0) {
            return res.status(404).send({ success: false, msg: "Empresa não encontrada para este usuário" });
        }
        res.send(result[0]); 
    });
};

const cadastrarServico = (req, res) => {
    const { titulo, descricao, duracao, valor, empresaId } = req.body;

    if (!titulo || !descricao || !duracao || !valor || !empresaId) {
        return res.status(400).send("Todos os campos são obrigatórios");
    }

    db.query("INSERT INTO Servicos (Nome, Descricao, Duracao, Preco, EmpresaID) VALUES (?, ?, ?, ?, ?)", 
        [titulo, descricao, duracao, valor, empresaId], 
        (err, response) => {
            if (err) {
                console.error("Erro ao cadastrar serviço:", err);
                return res.status(500).send("Erro ao cadastrar serviço");
            }
            console.log("Serviço cadastrado com sucesso");
            res.send("Serviço cadastrado com sucesso");
        }
    );
};


const adminRoute = (req, res) => {
    res.send('Welcome, Admin');
};

const clientRoute = (req, res) => {
    res.send('Welcome, Client');
};

module.exports = { register, login, cadastro_empresa, verifyJWT, roleMiddleware, adminRoute, clientRoute, listarEmpresas, cadastrarHorario, listarHorariosDisponiveis, getUser, registrarAgendamento, listarAgendamentos, listarHorariosDaEmpresa, deletarHorario, deletarAgendamento, listarEmpresaUsuarioLogado, cadastrarServico };
