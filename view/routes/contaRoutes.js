// view/routes/contaRoutes.js

const express = require('express');
const router = express.Router();
const ContaController = require('../../src/controller/contaController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// -------------------------------------------
// ROTAS ADMINISTRATIVAS (para Funcionários com permissão)
// -------------------------------------------

// ✅ CORRIGIDO: A rota agora é '/criar' e chama o método 'create' que existe.
router.post('/criar', 
    authMiddleware, 
    temPermissao(['ATENDENTE', 'GERENTE']), 
    ContaController.create
);

// ✅ CORRIGIDO: A rota agora é '/listar' e chama o método 'getAll'.
router.get('/listar', 
    authMiddleware, 
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    ContaController.getAll
);

// ✅ CORRIGIDO: A rota para buscar por ID usa o método 'getById'.
router.get('/:id', 
    authMiddleware, 
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    ContaController.getById
);

// -------------------------------------------
// ROTAS DE OPERAÇÕES FINANCEIRAS (para Clientes/Funcionários logados)
// -------------------------------------------

router.post('/deposito', authMiddleware, ContaController.realizarDeposito);
router.post('/saque', authMiddleware, ContaController.realizarSaque);
router.post('/transferencia', authMiddleware, ContaController.realizarTransferencia);
router.get('/extrato/:numeroConta', authMiddleware, ContaController.getExtrato);

module.exports = router;