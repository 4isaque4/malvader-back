// view/routes/relatorioRoutes.js

const express = require('express');
const router = express.Router();
const RelatorioController = require('../../src/controller/relatorioController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// Gerar relatório de movimentações (qualquer funcionário)
router.get('/movimentacoes',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    RelatorioController.gerarRelatorioMovimentacoes
);

// Gerar relatório de resumo de contas (qualquer funcionário)
router.get('/resumo-contas',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    RelatorioController.gerarRelatorioResumoContas
);

module.exports = router;