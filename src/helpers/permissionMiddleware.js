// src/helpers/permissionMiddleware.js

// Este é um "gerador de middleware". Ele recebe uma lista de cargos permitidos
// e retorna uma função de middleware que faz a verificação.
const temPermissao = (cargosPermitidos) => {
    return (req, res, next) => {
        // O authMiddleware deve ter sido executado antes, então req.usuario deve existir.
        const cargoDoUsuario = req.usuario?.cargo;

        if (!cargoDoUsuario) {
            return res.status(500).json({ erro: 'Informação de cargo não encontrada no token.' });
        }

        // Verifica se o cargo do usuário está na lista de cargos permitidos para a rota.
        if (cargosPermitidos.includes(cargoDoUsuario)) {
            next(); // Permissão concedida, continua para o controller.
        } else {
            // Permissão negada.
            res.status(403).json({ erro: 'Acesso negado. Você não tem permissão para esta ação.' });
        }
    };
};

module.exports = temPermissao;
