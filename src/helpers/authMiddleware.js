// src/helpers/authMiddleware.js

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Este middleware verifica o token JWT enviado em cada requisição protegida.
function authMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Formato: "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({ erro: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        // Verifica o token e decodifica o payload (que deve conter id_usuario, tipo_usuario, cargo, etc.)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Anexa os dados do usuário à requisição para uso posterior nos controllers e middlewares
        req.usuario = decoded; 
        
        next(); // Continua para a próxima etapa (outro middleware ou o controller)
    } catch (error) {
        res.status(401).json({ erro: 'Token inválido ou expirado.' });
    }
}

module.exports = authMiddleware;