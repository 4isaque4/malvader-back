// src/dao/usuarioDAO.js

const Usuario = require('../model/Usuario'); 
const Cliente = require('../model/Cliente');
const Funcionario = require('../model/Funcionario'); // ✅ Import adicionado
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
      return await Usuario.findOne({ 
        where: { email },
        include: [
            { model: Cliente, as: 'perfilCliente' },
            { model: Funcionario, as: 'perfilFuncionario' }
        ]
      });
    } catch (error) {
      console.error(`Erro ao buscar usuário por email ${email}:`, error);
      throw error;
    }
  }

  /**
   * ✅ MÉTODO ATUALIZADO E MAIS ROBUSTO
   * Busca um usuário pelo CPF ou pelo E-mail, incluindo os perfis de cliente e funcionário.
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
        // Inclui ambos os perfis possíveis. O Sequelize trará o que existir.
        include: [
            { model: Cliente, as: 'perfilCliente' },
            { model: Funcionario, as: 'perfilFuncionario' }
        ]
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