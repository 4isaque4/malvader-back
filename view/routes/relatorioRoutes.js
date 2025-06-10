// view/routes/relatorioRoutes.js

const express = require('express');
const router = express.Router();
const RelatorioController = require('../../src/controller/relatorioController');

// Rota para gerar o relatório de movimentações recentes
// Exemplo de acesso: GET http://localhost:3000/api/relatorios/movimentacoes
router.get('/movimentacoes', RelatorioController.gerarRelatorioMovimentacoes);

// Rota para gerar o relatório de resumo de contas
// Exemplo de acesso: GET http://localhost:3000/api/relatorios/resumo-contas
router.get('/resumo-contas', RelatorioController.gerarRelatorioResumoContas);


module.exports = router;