// view/routes/contaRoutes.js

const express = require('express');
const router = express.Router();
const ContaController = require('../../src/controller/contaController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// -------------------------------------------
// ROTAS ADMINISTRATIVAS (para Funcionários com permissão)
// -------------------------------------------

// Abertura de conta: Requer login e permissão de QUALQUER funcionário
router.post('/criar', 
    authMiddleware, 
    temPermissao(['ATENDENTE', 'GERENTE']), 
    ContaController.create
);

// Listar todas as contas: Requer login e permissão de QUALQUER funcionário
router.get('/listar', 
    authMiddleware, 
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']), // ✅ CORRIGIDO
    ContaController.getAll
);

// Buscar uma conta por ID: Requer login e permissão de QUALQUER funcionário
router.get('/:id', 
    authMiddleware, 
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']), // ✅ CORRIGIDO
    ContaController.getById
);

// -------------------------------------------
// ROTAS DE OPERAÇÕES FINANCEIRAS (para Clientes/Funcionários logados)
// -------------------------------------------
// Qualquer usuário logado pode tentar realizar uma operação. A lógica de
// se a operação é permitida (ex: o usuário é dono da conta) deve ficar no controller.

router.post('/deposito', authMiddleware, ContaController.realizarDeposito);
router.post('/saque', authMiddleware, ContaController.realizarSaque);
router.post('/transferencia', authMiddleware, ContaController.realizarTransferencia);
router.get('/extrato/:numeroConta', authMiddleware, ContaController.getExtrato);

module.exports = router;