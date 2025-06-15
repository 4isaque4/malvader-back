// src/dao/contaDAO.js

const sequelize = require('../util/database');
const Conta = require('../model/conta');
const Cliente = require('../model/cliente');
const Usuario = require('../model/usuario');
const Agencia = require('../model/agencia');
const ContaCorrente = require('../model/contaCorrente');
const ContaPoupanca = require('../model/contaPoupanca');
const ContaInvestimento = require('../model/contaInvestimento');

class ContaDAO {

    static async criar(dadosGerais, dadosEspecificos, { transaction }) {
        try {
            const novaConta = await Conta.create(dadosGerais, { transaction });
            const idConta = novaConta.idConta;

            if (dadosGerais.tipoConta === 'CORRENTE') {
                await ContaCorrente.create({ idConta, ...dadosEspecificos }, { transaction });
            } else if (dadosGerais.tipoConta === 'POUPANCA') {
                await ContaPoupanca.create({ idConta, ...dadosEspecificos }, { transaction });
            } else if (dadosGerais.tipoConta === 'INVESTIMENTO') {
                await ContaInvestimento.create({ idConta, ...dadosEspecificos }, { transaction });
            } else {
                throw new Error('Tipo de conta inválido para criação.');
            }
            return this.buscarPorId(idConta, { transaction });
        } catch (error) {
            console.error('Erro ao criar conta no DAO:', error);
            throw error;
        }
    }

    static async buscarPorId(id, options = {}) {
        try {
            return await Conta.findByPk(id, {
                ...options,
                include: [
                    { model: Cliente, as: 'cliente', include: { model: Usuario, as: 'dadosUsuario', attributes: { exclude: ['senhaHash'] } } },
                    { model: Agencia, as: 'agencia' },
                    { model: ContaCorrente, as: 'dadosCorrente' },
                    { model: ContaPoupanca, as: 'dadosPoupanca' },
                    { model: ContaInvestimento, as: 'dadosInvestimento' }
                ]
            });
        } catch (error) {
            console.error(`Erro ao buscar conta por ID ${id}:`, error);
            throw error;
        }
    }

    static async buscarPorNumeroConta(numeroConta) {
        try {
            return await Conta.findOne({
                where: { numeroConta },
                include: [
                    { model: Cliente, as: 'cliente', include: { model: Usuario, as: 'dadosUsuario', attributes: { exclude: ['senhaHash'] } } },
                    { model: Agencia, as: 'agencia' },
                    { model: ContaCorrente, as: 'dadosCorrente' },
                    { model: ContaPoupanca, as: 'dadosPoupanca' },
                    { model: ContaInvestimento, as: 'dadosInvestimento' }
                ]
            });
        } catch (error) {
            console.error(`Erro ao buscar conta por número ${numeroConta}:`, error);
            throw error;
        }
    }

    /**
     * NOVO MÉTODO ADICIONADO
     * Busca todas as contas do banco.
     * @returns {Promise<Array<Conta>>}
     */
    static async buscarTodas() {
        try {
            return await Conta.findAll({
                include: [
                    { 
                        model: Cliente, 
                        as: 'cliente', 
                        include: { 
                            model: Usuario, 
                            as: 'dadosUsuario', 
                            attributes: { exclude: ['senhaHash'] } 
                        } 
                    },
                    { model: Agencia, as: 'agencia' }
                ]
            });
        } catch (error) {
            console.error('Erro ao buscar todas as contas:', error);
            throw error;
        }
    }

    static async deletar(idConta, { transaction }) {
        try {
            const conta = await Conta.findByPk(idConta, { transaction });
            if (!conta) {
                return false;
            }
            
            await ContaCorrente.destroy({ where: { idConta }, transaction });
            await ContaPoupanca.destroy({ where: { idConta }, transaction });
            await ContaInvestimento.destroy({ where: { idConta }, transaction });
            
            await conta.destroy({ transaction });
            
            return true;
        } catch (error) {
            console.error(`Erro ao deletar conta com ID ${idConta}:`, error);
            throw error;
        }
    }
}

module.exports = ContaDAO;