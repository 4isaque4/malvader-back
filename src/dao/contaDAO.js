// src/dao/contaDAO.js

const sequelize = require('../util/database');
const Conta = require('../model/Conta');
const Cliente = require('../model/Cliente');
const Usuario = require('../model/Usuario');
const Agencia = require('../model/Agencia');
const ContaCorrente = require('../model/ContaCorrente');
const ContaPoupanca = require('../model/ContaPoupanca');
const ContaInvestimento = require('../model/ContaInvestimento');

class ContaDAO {

  /**
   * Cria uma nova conta e o registro específico do tipo de conta (Corrente, Poupança ou Investimento).
   * Este método DEVE ser chamado dentro de uma transação.
   * @param {object} dadosGerais - Dados para a tabela 'conta' (ex: { idCliente, idAgencia, tipoConta, ... }).
   * @param {object} dadosEspecificos - Dados para a tabela específica do tipo de conta.
   * @param {object} options - Opções, incluindo a transação.
   * @returns {Promise<Conta>} A nova conta criada, com todos os detalhes.
   */
  static async criar(dadosGerais, dadosEspecificos, { transaction }) {
    try {
      // 1. Cria o registro na tabela principal 'conta'
      const novaConta = await Conta.create(dadosGerais, { transaction });
      const idConta = novaConta.idConta;

      // 2. Cria o registro na tabela específica do tipo de conta
      if (dadosGerais.tipoConta === 'CORRENTE') {
        await ContaCorrente.create({ idConta, ...dadosEspecificos }, { transaction });
      } else if (dadosGerais.tipoConta === 'POUPANCA') {
        await ContaPoupanca.create({ idConta, ...dadosEspecificos }, { transaction });
      } else if (dadosGerais.tipoConta === 'INVESTIMENTO') {
        await ContaInvestimento.create({ idConta, ...dadosEspecificos }, { transaction });
      } else {
        throw new Error('Tipo de conta inválido para criação.');
      }

      // 3. Busca e retorna a conta completa com todos os dados associados
      return this.buscarPorId(idConta, { transaction });

    } catch (error) {
      console.error('Erro ao criar conta no DAO:', error);
      throw error; // Re-lança para o controller fazer o rollback
    }
  }

  /**
   * Busca uma conta pelo seu ID, incluindo todos os dados associados.
   * @param {number} id
   * @param {object} options - Opções, incluindo a transação.
   * @returns {Promise<Conta|null>}
   */
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

  /**
   * Busca uma conta pelo seu número, incluindo todos os dados associados.
   * @param {string} numeroConta
   * @returns {Promise<Conta|null>}
   */
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
   * Deleta uma conta e seus registros associados de tipo específico.
   * Deve ser executado em uma transação pelo controller.
   * @param {number} idConta
   * @param {object} options - Opções, incluindo a transação.
   * @returns {Promise<boolean>}
   */
  static async deletar(idConta, { transaction }) {
    try {
      const conta = await Conta.findByPk(idConta, { transaction });
      if (!conta) {
        return false;
      }
      
      // Deleta primeiro os registros das tabelas de tipo de conta para evitar erros de FK
      await ContaCorrente.destroy({ where: { idConta }, transaction });
      await ContaPoupanca.destroy({ where: { idConta }, transaction });
      await ContaInvestimento.destroy({ where: { idConta }, transaction });

      // Opcional: Adicionar lógica para verificar transações antes de deletar
      // ...
      
      // Deleta a conta principal
      await conta.destroy({ transaction });
      
      return true;

    } catch (error) {
      console.error(`Erro ao deletar conta com ID ${idConta}:`, error);
      throw error;
    }
  }
}

module.exports = ContaDAO;
