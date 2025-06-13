// view/routes/funcionarioRoutes.js

const express = require('express');
const router = express.Router();
const FuncionarioController = require('../../src/controller/funcionarioController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// Criar um novo funcionário (apenas gerentes)
router.post('/criar',
   authMiddleware,
   temPermissao(['GERENTE']),
    FuncionarioController.create
);

// Listar todos os funcionários
router.get('/listar',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    FuncionarioController.getAll
);

// Atualizar um funcionário (apenas gerentes)
router.put('/:cpf',
    authMiddleware,
    temPermissao(['GERENTE']),
    FuncionarioController.update
);

// Deletar um funcionário (apenas gerentes)
router.delete('/:cpf',
    authMiddleware,
    temPermissao(['GERENTE']),
    FuncionarioController.delete
);

module.exports = router;