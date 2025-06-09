// src/dao/usuarioDAO.js

// Importa o modelo de Usuário que criamos com o Sequelize
const Usuario = require('../model/Usuario'); 
const { Op } = require('sequelize'); // Importa o operador 'Or' do Sequelize

class UsuarioDAO {
  
  /**
   * Busca todos os usuários cadastrados no banco de dados.
   * @returns {Promise<Array<Usuario>>} Uma lista de todos os usuários.
   */
  static async buscarTodos() {
    try {
      return await Usuario.findAll();
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw error;
    }
  }

  /**
   * Busca um usuário específico pelo seu endereço de e-mail.
   * @param {string} email - O e-mail do usuário a ser buscado.
   * @returns {Promise<Usuario|null>} O objeto do usuário se encontrado, caso contrário null.
   */
  static async buscarPorEmail(email) {
    try {
      return await Usuario.findOne({ where: { email: email } });
    } catch (error) {
      console.error(`Erro ao buscar usuário por email ${email}:`, error);
      throw error;
    }
  }

  /**
   * Busca um usuário pelo CPF ou pelo E-mail para verificar duplicidade.
   * @param {string} cpf - O CPF do usuário.
   * @param {string} email - O e-mail do usuário.
   * @returns {Promise<Usuario|null>} O usuário se encontrado, caso contrário null.
   */
  static async buscarPorCpfOuEmail(cpf, email) {
    try {
      return await Usuario.findOne({
        where: {
          [Op.or]: [
            { CPF: cpf },
            { email: email }
          ]
        }
      });
    } catch (error) {
      console.error(`Erro ao buscar por CPF ou E-mail:`, error);
      throw error;
    }
  }

  /**
   * Cria um novo usuário no banco de dados.
   * @param {object} dadosUsuario - Os dados do usuário a serem criados (nome, cpf, email, etc.).
   * @returns {Promise<Usuario>} O novo usuário criado.
   */
  static async criar(dadosUsuario) {
    try {
      return await Usuario.create(dadosUsuario);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }

  // Você pode adicionar outras funções aqui no futuro, como:
  // static async atualizar(idUsuario, novosDados) { ... }
  // static async deletar(idUsuario) { ... }
}

module.exports = UsuarioDAO;
