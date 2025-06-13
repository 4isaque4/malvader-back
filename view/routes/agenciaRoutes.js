// view/routes/agenciaRoutes.js

const express = require('express');
const router = express.Router();
const AgenciaController = require('../../src/controller/agenciaController');
const authMiddleware = require('../../src/helpers/authMiddleware');
const temPermissao = require('../../src/helpers/permissionMiddleware');

// Apenas um GERENTE logado pode criar uma nova agência
router.post('/criar',
    authMiddleware,
    temPermissao(['GERENTE']),
    AgenciaController.create
);

// Qualquer funcionário logado pode listar as agências
router.get('/listar',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    AgenciaController.getAll
);

// Qualquer funcionário logado pode ver os detalhes de uma agência
router.get('/:id',
    authMiddleware,
    temPermissao(['ESTAGIARIO', 'ATENDENTE', 'GERENTE']),
    AgenciaController.getById
);

module.exports = router;