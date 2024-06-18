const express = require('express');
const router = express.Router();
const { register, login, cadastro_empresa, listarEmpresas, cadastrarHorario, listarHorariosDisponiveis, getUser, verifyJWT, registrarAgendamento, listarAgendamentos, listarHorariosDaEmpresa, deletarHorario, deletarAgendamento, listarEmpresaUsuarioLogado, cadastrarServico, listarServicosDaEmpresa } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/cadastro_empresa', cadastro_empresa);
router.get('/main/admin/empresas', listarEmpresas); 
router.post('/main/admin/cadastrar_horario', cadastrarHorario);
router.get('/main/cliente/horarios_disponiveis', listarHorariosDisponiveis);
router.get('/user', verifyJWT, getUser);
router.post('/agendamento', verifyJWT, registrarAgendamento);
router.get('/listarAgendamentos', verifyJWT ,listarAgendamentos)
router.get('/main/cliente/horarios', verifyJWT, listarHorariosDaEmpresa);
router.delete('/main/admin/deletar_horario/:horarioId', verifyJWT, deletarHorario);
router.delete('/main/cliente/deletar_agendamento/:agendamentoId', verifyJWT, deletarAgendamento);
router.get('/minha-empresa', verifyJWT, listarEmpresaUsuarioLogado);
router.post('/cadastrar_servico', cadastrarServico);
router.get('/servicos', verifyJWT, listarServicosDaEmpresa); 


module.exports = router;
