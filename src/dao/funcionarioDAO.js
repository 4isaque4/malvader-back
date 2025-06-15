// src/dao/funcionarioDAO.js

const sequelize = require('../util/database');
const Usuario = require('../model/usuario');
const Funcionario = require('../model/funcionario');

class FuncionarioDAO {
  
  /**
   * Busca todos os funcionários e inclui os dados do usuário associado.
   * @returns {Promise<Array<Funcionario>>} Uma lista de todos os funcionários com seus dados de usuário.
   */
  static async buscarTodos() {
    try {
      return await Funcionario.findAll({
        include: {
          model: Usuario,
          as: 'dadosUsuario', // Usa o alias definido na associação
          attributes: { exclude: ['senhaHash', 'otpAtivo', 'otpExpiracao'] } // Exclui campos sensíveis
        }
      });
    } catch (error) {
      console.error("Erro ao buscar todos os funcionários:", error);
      throw error;
    }
  }

  /**
   * Cria um novo registro de funcionário.
   * @param {object} dadosFuncionario - Dados para criar o funcionário.
   * @param {object} options - Opções adicionais, como a transação.
   * @returns {Promise<Funcionario>} O novo funcionário criado.
   */
  static async criar(dadosFuncionario, options = {}) {
    try {
      return await Funcionario.create(dadosFuncionario, options);
    } catch (error) {
      console.error("Erro ao criar funcionário:", error);
      throw error;
    }
  }

  /**
   * Atualiza os dados de um funcionário e do usuário associado a ele, identificado pelo CPF.
   * @param {string} cpf - O CPF do usuário-funcionário.
   * @param {object} dados - Objeto contendo dados do usuário e do funcionário a serem atualizados.
   * @returns {Promise<Funcionario|null>} O funcionário atualizado com os dados do usuário.
   */
  static async atualizarPorCpf(cpf, dados) {
    const t = await sequelize.transaction();
    try {
      const usuario = await Usuario.findOne({ where: { cpf } }, { transaction: t });
      if (!usuario) {
        await t.rollback();
        return null;
      }

      const funcionario = await Funcionario.findOne({ where: { idUsuario: usuario.id_usuario } }, { transaction: t });
      if (!funcionario) {
        await t.rollback();
        return null;
      }

      // Atualiza os dados do usuário e do funcionário
      if (dados.dadosUsuario) await usuario.update(dados.dadosUsuario, { transaction: t });
      if (dados.dadosFuncionario) await funcionario.update(dados.dadosFuncionario, { transaction: t });

      await t.commit();
      
      // Recarrega o funcionário com os dados atualizados do usuário para retornar a informação completa
      return await Funcionario.findByPk(funcionario.idFuncionario, {
        include: { model: Usuario, as: 'dadosUsuario' }
      });

    } catch (error) {
      await t.rollback();
      console.error(`Erro ao atualizar funcionário com CPF ${cpf}:`, error);
      throw error;
    }
  }

  /**
   * Deleta um funcionário e o usuário associado a ele, identificado pelo CPF.
   * @param {string} cpf - O CPF do usuário-funcionário a ser deletado.
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
      
      // A deleção do funcionário acontece primeiro para respeitar a chave estrangeira.
      // O banco de dados está configurado para SET NULL no campo 'id_supervisor'
      // dos subordinados, então a hierarquia é mantida.
      await Funcionario.destroy({ where: { idUsuario: usuario.id_usuario } }, { transaction: t });
      
      // Depois deleta o registro de usuário
      await usuario.destroy({ transaction: t });

      await t.commit();
      return true;

    } catch (error) {
      await t.rollback();
      console.error(`Erro ao deletar funcionário com CPF ${cpf}:`, error);
      throw error;
    }
  }
}

module.exports = FuncionarioDAO;
