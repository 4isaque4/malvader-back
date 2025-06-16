// view/routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
const UsuarioController = require('../../src/controller/usuarioController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// --- ROTAS PÚBLICAS ---
router.post('/login', UsuarioController.login);
router.post('/solicitar-otp', UsuarioController.solicitarOTP);
router.post('/verificar-otp', UsuarioController.verificarOTP);

// --- ROTAS PROTEGIDAS ---

// Listar todos os usuários (apenas funcionários)
router.get('/listar',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    UsuarioController.getAll
);

// Alterar o próprio e-mail (qualquer usuário logado)
router.put('/alterar-email',
    authMiddleware,
    UsuarioController.alterarEmail
);

// Alterar a própria senha (qualquer usuário logado)
router.put('/alterar-senha',
    authMiddleware,
    UsuarioController.alterarSenha
);

// Deletar um usuário pelo CPF (apenas gerentes)
router.delete('/:cpf',
    authMiddleware,
    temPermissao(['GERENTE']),
    UsuarioController.deletarUsuarioPorAdmin
);

module.exports = router;