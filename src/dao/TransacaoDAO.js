// src/dao/transacaoDAO.js

const sequelize = require('../util/database');
const { Op } = require('sequelize');
const Transacao = require('../model/Transacao'); // Caminho corrigido
const Conta = require('../model/Conta');       // Caminho corrigido

class TransacaoDAO {

    /**
     * Cria um registro de transação e atualiza os saldos das contas.
     * Este método deve SEMPRE ser chamado dentro de uma transação Sequelize.
     * @param {object} dados - { idContaOrigem, idContaDestino, valor, tipoTransacao, descricao }
     * @param {object} transaction - O objeto de transação do Sequelize.
     * @returns {Promise<Transacao>}
     */
    static async criar(dados, { transaction }) {
        const { idContaOrigem, idContaDestino, valor, tipoTransacao, descricao } = dados;

        try {
            // 1. Atualiza saldo da conta de origem (se houver)
            if (idContaOrigem) {
                const contaOrigem = await Conta.findByPk(idContaOrigem, {
                    lock: transaction.LOCK.UPDATE, // Trava a linha para evitar race conditions
                    transaction
                });
                
                // Validação de saldo
                if (!contaOrigem || contaOrigem.saldo < valor) {
                    throw new Error('Saldo insuficiente na conta de origem.');
                }
                contaOrigem.saldo -= valor;
                await contaOrigem.save({ transaction });
            }

            // 2. Atualiza saldo da conta de destino (se houver)
            if (idContaDestino) {
                const contaDestino = await Conta.findByPk(idContaDestino, {
                    lock: transaction.LOCK.UPDATE,
                    transaction
                });

                if (!contaDestino) {
                    throw new Error('Conta de destino não encontrada.');
                }
                contaDestino.saldo += valor;
                await contaDestino.save({ transaction });
            }

            // 3. Cria o registro da transação usando as propriedades camelCase
            return await Transacao.create({
                idContaOrigem,
                idContaDestino,
                valor,
                tipoTransacao,
                descricao
            }, { transaction });

        } catch (error) {
            console.error('Erro durante a criação da transação no DAO:', error);
            // Re-lança o erro para que o controller possa fazer o rollback da transação
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
                        // Usa as propriedades camelCase do modelo
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
}

module.exports = TransacaoDAO;
