// src/dao/usuarioDAO.js

const Usuario = require('../model/Usuario'); 
const Cliente = require('../model/Cliente'); // ✅ Adicionado para a inclusão
const { Op } = require('sequelize');

class UsuarioDAO {
  
  static async buscarTodos() {
    try {
      return await Usuario.findAll({
        attributes: { exclude: ['senhaHash', 'otpAtivo', 'otpExpiracao'] }
      });
    } catch (error) {
      console.error("Erro ao buscar todos os usuários:", error);
      throw error;
    }
  }

  static async buscarPorEmail(email) {
    try {
      return await Usuario.findOne({ where: { email } });
    } catch (error) {
      console.error(`Erro ao buscar usuário por email ${email}:`, error);
      throw error;
    }
  }

  /**
   * MÉTODO CORRIGIDO: Agora inclui o perfil de cliente associado na busca.
   * Busca um usuário pelo CPF ou pelo E-mail para verificar duplicidade.
   * @param {string} cpf - O CPF do usuário.
   * @param {string} email - O e-mail do usuário.
   * @returns {Promise<Usuario|null>} O usuário se encontrado, com seu perfil de cliente.
   */
  static async buscarPorCpfOuEmail(cpf, email) {
    try {
      return await Usuario.findOne({
        where: {
          [Op.or]: [
            { cpf: cpf },
            { email: email }
          ]
        },
        // A inclusão do modelo Cliente garante que 'perfilCliente' não será undefined.
        include: {
            model: Cliente,
            as: 'perfilCliente' 
        }
      });
    } catch (error) {
      console.error(`Erro ao buscar por CPF ou E-mail:`, error);
      throw error;
    }
  }
  
  static async buscarPorEmailEOTP(email, otp) {
    try {
      return await Usuario.findOne({
        where: {
          email: email,
          otpAtivo: otp
        }
      });
    } catch (error) {
      console.error(`Erro ao buscar usuário por e-mail e OTP:`, error);
      throw error;
    }
  }

  static async criar(dadosUsuario, options = {}) {
    try {
      return await Usuario.create(dadosUsuario, options);
    } catch (error) {
      console.error("Erro ao criar usuário:", error);
      throw error;
    }
  }
}

module.exports = UsuarioDAO;
