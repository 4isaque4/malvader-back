const sequelize = require('../util/database');
const { Op } = require('sequelize');
const Transacao = require('../model/Transacao');
const Conta = require('../model/Conta');

class TransacaoDAO {

    /**
     * Cria um registro de transação. A atualização dos saldos é feita por um TRIGGER no banco de dados.
     * Este método deve ser chamado dentro de uma transação do Sequelize para garantir a atomicidade.
     * @param {object} dados - { idContaOrigem, idContaDestino, valor, tipoTransacao, descricao }
     * @param {object} options - Opções que podem incluir a transação.
     * @returns {Promise<Transacao>}
     */
    static async criar(dados, options = {}) {
        try {
            // A lógica de atualização de saldo foi removida daqui porque agora é
            // gerenciada por um TRIGGER diretamente no banco de dados,
            // o que é mais seguro e eficiente. O DAO apenas cria o registro da transação.
            return await Transacao.create(dados, options);
        } catch (error) {
            console.error('Erro durante a criação da transação no DAO:', error);
            throw error;
        }
    }

    /**
     * Busca uma transação pelo seu ID, incluindo contas de origem e destino.
     * @param {number} id
     * @returns {Promise<Transacao|null>}
     */
    static async buscarPorId(id) {
        try {
            return await Transacao.findByPk(id, {
                include: [
                    { model: Conta, as: 'contaOrigem' },
                    { model: Conta, as: 'contaDestino' }
                ]
            });
        } catch (error) {
            console.error(`Erro ao buscar transação por ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Busca todas as transações de uma conta específica (extrato bancário).
     * @param {number} idConta
     * @param {object} options - { limit, offset } para paginação
     * @returns {Promise<{count: number, rows: Transacao[]}>}
     */
    static async buscarExtratoDaConta(idConta, { limit = 50, offset = 0 } = {}) {
        try {
            return await Transacao.findAndCountAll({
                where: {
                    [Op.or]: [
                        // CORRIGIDO: Usa as propriedades camelCase do modelo.
                        { idContaOrigem: idConta },
                        { idContaDestino: idConta }
                    ]
                },
                include: [
                    { model: Conta, as: 'contaOrigem', attributes: ['idConta', 'numeroConta'] },
                    { model: Conta, as: 'contaDestino', attributes: ['idConta', 'numeroConta'] }
                ],
                order: [['dataHora', 'DESC']],
                limit,
                offset
            });
        } catch (error) {
            console.error(`Erro ao buscar extrato para a conta ${idConta}:`, error);
            throw error;
        }
    }
    
    /**
     * Lista todas as transações do sistema (rota de administrador).
     * @param {object} options - { limit, offset } para paginação
     * @returns {Promise<{count: number, rows: Transacao[]}>}
     */
    static async buscarTodas({ limit = 25, offset = 0 } = {}) {
        try {
            return await Transacao.findAndCountAll({
                include: [
                    { model: Conta, as: 'contaOrigem', attributes: ['idConta', 'numeroConta'] },
                    { model: Conta, as: 'contaDestino', attributes: ['idConta', 'numeroConta'] }
                ],
                order: [['dataHora', 'DESC']],
                limit,
                offset
            });
        } catch (error)
        {
            console.error("Erro ao buscar todas as transações:", error);
            throw error;
        }
    }
}

module.exports = TransacaoDAO;