const { Op } = require('sequelize');
const Transacao = require('../models/Transacao'); // Ajuste o caminho para seus modelos
const Conta = require('../models/Conta');
const sequelize = require('../util/database'); // Import da instância do Sequelize

class TransacaoDAO {

    /**
     * Cria um registro de transação e atualiza os saldos das contas envolvidas.
     * Esta é a operação mais crítica e deve ser usada dentro de uma transação do Sequelize.
     * @param {object} dados - { id_conta_origem, id_conta_destino, valor, tipo_transacao, descricao }
     * @param {object} t - O objeto de transação do Sequelize.
     * @returns {Promise<Transacao>}
     */
    async _criarTransacaoEAtualizarSaldos(dados, t) {
        const { id_conta_origem, id_conta_destino, valor, tipo_transacao, descricao } = dados;

        // 1. Atualizar saldo da conta de origem (se houver)
        if (id_conta_origem) {
            const contaOrigem = await Conta.findByPk(id_conta_origem, { lock: t.LOCK.UPDATE, transaction: t });
            if (!contaOrigem || contaOrigem.saldo < valor) {
                throw new Error('Saldo insuficiente na conta de origem.');
            }
            contaOrigem.saldo -= parseFloat(valor);
            await contaOrigem.save({ transaction: t });
        }

        // 2. Atualizar saldo da conta de destino (se houver)
        if (id_conta_destino) {
            const contaDestino = await Conta.findByPk(id_conta_destino, { lock: t.LOCK.UPDATE, transaction: t });
            if (!contaDestino) {
                throw new Error('Conta de destino não encontrada.');
            }
            contaDestino.saldo += parseFloat(valor);
            await contaDestino.save({ transaction: t });
        }

        // 3. Criar o registro da transação
        const transacao = await Transacao.create({
            id_conta_origem,
            id_conta_destino,
            valor,
            tipo_transacao,
            descricao
        }, { transaction: t });

        return transacao;
    }

    /**
     * Realiza uma transferência completa entre duas contas de forma segura.
     * @param {number} id_conta_origem
     * @param {number} id_conta_destino
     * @param {number} valor
     * @param {string} [descricao]
     * @returns {Promise<Transacao>}
     */
    async realizarTransferencia(id_conta_origem, id_conta_destino, valor, descricao = 'Transferência entre contas') {
        return sequelize.transaction(async (t) => {
            return this._criarTransacaoEAtualizarSaldos({
                id_conta_origem,
                id_conta_destino,
                valor,
                tipo_transacao: 'Transferência',
                descricao
            }, t);
        });
    }

    /**
     * Realiza um depósito em uma conta.
     * @param {number} id_conta_destino
     * @param {number} valor
     * @param {string} [descricao]
     * @returns {Promise<Transacao>}
     */
    async realizarDeposito(id_conta_destino, valor, descricao = 'Depósito em conta') {
        return sequelize.transaction(async (t) => {
            return this._criarTransacaoEAtualizarSaldos({
                id_conta_origem: null,
                id_conta_destino,
                valor,
                tipo_transacao: 'Depósito',
                descricao
            }, t);
        });
    }

    /**
     * Realiza um saque de uma conta.
     * @param {number} id_conta_origem
     * @param {number} valor
     * @param {string} [descricao]
     * @returns {Promise<Transacao>}
     */
    async realizarSaque(id_conta_origem, valor, descricao = 'Saque de conta') {
        return sequelize.transaction(async (t) => {
            return this._criarTransacaoEAtualizarSaldos({
                id_conta_origem,
                id_conta_destino: null,
                valor,
                tipo_transacao: 'Saque',
                descricao
            }, t);
        });
    }

    /**
     * Busca uma transação pelo seu ID.
     * @param {number} id
     * @returns {Promise<Transacao|null>}
     */
    async buscarPorId(id) {
        return Transacao.findByPk(id, {
            include: [
                { model: Conta, as: 'contaOrigem' },
                { model: Conta, as: 'contaDestino' }
            ]
        });
    }

    /**
     * Busca todas as transações de uma conta específica (extrato bancário).
     * @param {number} contaId
     * @param {object} options - { limit, offset } para paginação
     * @returns {Promise<{count: number, rows: Transacao[]}>}
     */
    async buscarExtratoDaConta(contaId, { limit = 10, offset = 0 } = {}) {
        return Transacao.findAndCountAll({
            where: {
                [Op.or]: [
                    { id_conta_origem: contaId },
                    { id_conta_destino: contaId }
                ]
            },
            include: [
                { model: Conta, as: 'contaOrigem', attributes: ['id_conta', 'numero_conta'] },
                { model: Conta, as: 'contaDestino', attributes: ['id_conta', 'numero_conta'] }
            ],
            order: [['data_hora', 'DESC']],
            limit,
            offset
        });
    }
}

// Exporta uma instância única do DAO (padrão Singleton)
module.exports = new TransacaoDAO();