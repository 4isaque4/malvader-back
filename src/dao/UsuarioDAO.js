// src/dao/usuarioDAO.js

const Usuario = require('../model/Usuario'); 
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

  static async buscarPorCpfOuEmail(cpf, email) {
    try {
      return await Usuario.findOne({
        where: {
          [Op.or]: [
            { cpf },
            { email }
          ]
        }
      });
    } catch (error) {
      console.error(`Erro ao buscar por CPF ou E-mail:`, error);
      throw error;
    }
  }

  /**
   * ✅ MÉTODO FALTANTE ADICIONADO:
   * Busca um usuário pelo e-mail e pelo OTP fornecido.
   * @param {string} email - O e-mail do usuário.
   * @param {string} otp - O código OTP a ser verificado.
   * @returns {Promise<Usuario|null>} Retorna o usuário se a combinação for encontrada.
   */
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
