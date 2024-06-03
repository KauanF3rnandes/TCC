const express = require('express');
const router = express.Router();
const { register, login, cadastro_empresa, listarEmpresas, cadastrarHorario, listarHorariosDisponiveis, getUser, verifyJWT, registrarAgendamento, listarAgendamentos, listarHorariosDaEmpresa } = require('../controllers/authController');

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



module.exports = router;
