// view/routes/clienteRoutes.js

const express = require('express');
const router = express.Router();
const ClienteController = require('../../src/controller/clienteController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// Criar um novo cliente (parte do processo de abertura de conta)
router.post('/criar',
    authMiddleware,
    temPermissao(['ATENDENTE', 'GERENTE']),
    ClienteController.create
);

// Listar todos os clientes
router.get('/listar',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    ClienteController.getAll
);

// Atualizar um cliente (requer permissão de gerente)
router.put('/:cpf',
    authMiddleware,
    temPermissao(['GERENTE']),
    ClienteController.update
);

// Deletar um cliente (requer permissão de gerente)
router.delete('/:cpf',
    authMiddleware,
    temPermissao(['GERENTE']),
    ClienteController.delete
);

module.exports = router;