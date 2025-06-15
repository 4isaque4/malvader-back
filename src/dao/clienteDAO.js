// src/dao/clienteDAO.js

const sequelize = require('../util/database');
const Usuario = require('../model/usuario');
const Cliente = require('../model/cliente');

class ClienteDAO {
  
  /**
   * Busca todos os clientes e inclui os dados do usuário associado.
   * @returns {Promise<Array<Cliente>>} Uma lista de todos os clientes com seus dados de usuário.
   */
  static async buscarTodos() {
    try {
      return await Cliente.findAll({
        include: {
          model: Usuario,
          as: 'dadosUsuario', // Usa o 'as' definido na associação do modelo
          attributes: { exclude: ['senhaHash', 'otpAtivo', 'otpExpiracao'] } // Exclui campos sensíveis
        }
      });
    } catch (error) {
      console.error("Erro ao buscar todos os clientes:", error);
      throw error;
    }
  }

  /**
   * Cria um novo registro de cliente.
   * @param {object} dadosCliente - Dados para criar o cliente (ex: { idUsuario, scoreCredito }).
   * @param {object} options - Opções adicionais, como a transação.
   * @returns {Promise<Cliente>} O novo cliente criado.
   */
  static async criar(dadosCliente, options = {}) {
    try {
      return await Cliente.create(dadosCliente, options);
    } catch (error) {
      console.error("Erro ao criar cliente:", error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um cliente e do usuário associado a ele, identificado pelo CPF.
   * @param {string} cpf - O CPF do usuário-cliente.
   * @param {object} dados - Objeto contendo dados do usuário e do cliente a serem atualizados.
   * @returns {Promise<Cliente|null>} O cliente atualizado com os dados do usuário.
   */
  static async atualizarPorCpf(cpf, dados) {
    const t = await sequelize.transaction();
    try {
      const usuario = await Usuario.findOne({ where: { cpf } }, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return null;
      }

      const cliente = await Cliente.findOne({ where: { idUsuario: usuario.id_usuario } }, { transaction: t });
      if (!cliente) {
        await t.rollback();
        return null;
      }

      // Atualiza os dados do usuário e do cliente
      await usuario.update(dados.dadosUsuario, { transaction: t });
      await cliente.update(dados.dadosCliente, { transaction: t });

      await t.commit();
      
      // Recarrega o cliente com os dados atualizados do usuário para retornar a informação completa
      return await Cliente.findByPk(cliente.idCliente, {
        include: { model: Usuario, as: 'dadosUsuario' }
      });

    } catch (error) {
      await t.rollback();
      console.error(`Erro ao atualizar cliente com CPF ${cpf}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um cliente e o usuário associado a ele, identificado pelo CPF.
   * @param {string} cpf - O CPF do usuário-cliente a ser deletado.
   * @returns {Promise<boolean>} Retorna true se a deleção foi bem-sucedida, false caso contrário.
   */
  static async deletarPorCpf(cpf) {
    const t = await sequelize.transaction();
    try {
      const usuario = await Usuario.findOne({ where: { cpf } }, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return false;
      }

      // Deleta o registro de cliente primeiro para respeitar a chave estrangeira
      await Cliente.destroy({ where: { idUsuario: usuario.id_usuario } }, { transaction: t });
      
      // Depois deleta o registro de usuário
      await usuario.destroy({ transaction: t });

      await t.commit();
      return true;

    } catch (error) {
      await t.rollback();
      console.error(`Erro ao deletar cliente com CPF ${cpf}:`, error);
      throw error;
    }
  }
}

module.exports = ClienteDAO;
