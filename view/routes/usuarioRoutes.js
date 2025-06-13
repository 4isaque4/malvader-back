// view/routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const UsuarioController = require('../../src/controller/usuarioController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// ROTA PÚBLICA: para qualquer pessoa fazer login
router.post('/login', UsuarioController.login);

// ROTAS PÚBLICAS: para o fluxo de autenticação com OTP
router.post('/solicitar-otp', UsuarioController.solicitarOTP);
router.post('/verificar-otp', UsuarioController.verificarOTP);

// ROTA PROTEGIDA: Apenas funcionários logados podem ver a lista de todos os usuários
router.get('/listar',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    UsuarioController.getAll
);

module.exports = router;