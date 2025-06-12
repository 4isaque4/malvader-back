// view/routes/transacaoRoutes.js

const express = require('express');
const router = express.Router();
const TransacaoController = require('../../src/controller/transacaoController');

// Rota para listar todas as transações (com paginação)
// Exemplo de acesso: GET http://localhost:3000/api/transacoes
router.get('/', TransacaoController.getAll);

// Rota para buscar uma transação específica pelo ID
// Exemplo de acesso: GET http://localhost:3000/api/transacoes/1
router.get('/:id', TransacaoController.getById);

module.exports = router;