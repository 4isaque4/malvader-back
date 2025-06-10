// view/routes/agenciaRoutes.js

const express = require('express');
const router = express.Router();
const AgenciaController = require('../../src/controller/agenciaController');

// Rota para criar uma nova agência (junto com seu endereço)
// Exemplo de acesso: POST http://localhost:3000/api/agencias/criar
router.post('/criar', AgenciaController.create);

// Rota para listar todas as agências
// Exemplo de acesso: GET http://localhost:3000/api/agencias/listar
router.get('/listar', AgenciaController.getAll);

// Rota para buscar uma agência específica pelo ID
// Exemplo de acesso: GET http://localhost:3000/api/agencias/1
router.get('/:id', AgenciaController.getById);

module.exports = router;
