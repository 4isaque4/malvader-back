// view/routes/transacaoRoutes.js

const express = require('express');
const router = express.Router();
const TransacaoController = require('../../src/controller/transacaoController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// Listar todas as transações do sistema (requer permissão)
router.get('/',
    authMiddleware,
    temPermissao(['ATENDENTE', 'GERENTE']),
    TransacaoController.getAll
);

// Buscar uma transação específica pelo ID (requer permissão)
router.get('/:id',
    authMiddleware,
    temPermissao(['ATENDENTE', 'GERENTE']),
    TransacaoController.getById
);

module.exports = router;