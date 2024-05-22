const express = require('express');
const router = express.Router();
const { register, login, cadastro_empresa, listarEmpresas, cadastrarHorario, listarHorariosDisponiveis } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/cadastro_empresa', cadastro_empresa);
router.get('/main/admin/empresas', listarEmpresas); 
router.post('/main/admin/cadastrar_horario', cadastrarHorario);
router.get('/main/cliente/horarios_disponiveis', listarHorariosDisponiveis);

module.exports = router;
