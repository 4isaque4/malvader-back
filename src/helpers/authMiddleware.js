// src/helpers/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

function authMiddleware(req, res, next) {
    console.log('--- 1. MIDDLEWARE DE AUTENTICAÇÃO ATIVADO ---'); // DEBUG
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log('DEBUG: Token não encontrado no header.'); // DEBUG
        return res.status(401).json({ erro: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        console.log('--- 2. TOKEN DECodificado COM SUCESSO ---'); // DEBUG
        console.log('Payload do Token:', decoded); // DEBUG - Mostra o conteúdo do token
        
        req.usuario = decoded; 
        
        console.log('--- 3. USUÁRIO ANEXADO À REQUISIÇÃO. SEGUINDO PARA O CONTROLLER ---'); // DEBUG
        next();
    } catch (error) {
        console.log('DEBUG: Erro ao verificar o token:', error.message); // DEBUG
        res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;