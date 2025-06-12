// src/controller/transacaoController.js

const TransacaoDAO = require('../dao/transacaoDAO');

class TransacaoController {

    /**
     * Lista todas as transações do sistema com paginação.
     * Rota de acesso restrito (ex: administradores).
     */
    static async getAll(req, res) {
        try {
            // Lógica de paginação a partir da query string (ex: /transacoes?page=1&limit=10)
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 25;
            const offset = (page - 1) * limit;

            const transacoes = await TransacaoDAO.buscarTodas({ limit, offset });
            res.status(200).json(transacoes);
        } catch (error) {
            console.error("Erro no controller ao listar transações:", error);
            res.status(500).json({ erro: 'Falha ao listar transações.' });
        }
    }

    /**
     * Busca e retorna os detalhes de uma única transação pelo seu ID.
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const transacao = await TransacaoDAO.buscarPorId(id);

            if (transacao) {
                res.status(200).json(transacao);
            } else {
                res.status(404).json({ erro: 'Transação não encontrada.' });
            }
        } catch (error) {
            console.error("Erro no controller ao buscar transação por ID:", error);
            res.status(500).json({ erro: 'Falha ao buscar transação.' });
        }
    }
}

module.exports = TransacaoController;