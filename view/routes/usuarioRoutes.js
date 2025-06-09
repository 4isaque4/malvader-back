// view/routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const UsuarioController = require('../../src/controller/usuarioController');

// Rota para listar todos os usuários
// URL Final: GET /api/usuarios/listar
router.get('/listar', UsuarioController.getAll);

// Rota para criar um novo usuário
// URL Final: POST /api/usuarios/criar
router.post('/criar', UsuarioController.create);


// URL Final: POST /api/usuarios/solicitar-otp
router.post('/solicitar-otp', UsuarioController.solicitarOTP);


// URL Final: POST /api/usuarios/verificar-otp
router.post('/verificar-otp', UsuarioController.verificarOTP);


module.exports = router;