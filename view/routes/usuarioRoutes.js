// view/routes/usuarioRoutes.js

const express = require('express');
const router = express.Router();
// Garante que o nome do arquivo importado tenha a capitalização correta.
const UsuarioController = require('../../src/controller/usuarioController');

// Rota para listar todos os usuários
// URL Final: GET /api/usuarios/listar
router.get('/listar', UsuarioController.getAll);

// Rota de criação foi REMOVIDA. A criação de usuários agora é feita através de:
// POST /api/clientes/criar
// ou
// POST /api/funcionarios/criar


// URL Final: POST /api/usuarios/solicitar-otp
router.post('/solicitar-otp', UsuarioController.solicitarOTP);


// URL Final: POST /api/usuarios/verificar-otp
router.post('/verificar-otp', UsuarioController.verificarOTP);


module.exports = router;
