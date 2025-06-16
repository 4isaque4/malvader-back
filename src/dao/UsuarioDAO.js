// src/dao/usuarioDAO.js

const sequelize = require('../util/database');
const Usuario = require('../model/Usuario'); 
const Cliente = require('../model/Cliente');
const Funcionario = require('../model/Funcionario');
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
    
    static async buscarPorId(id_usuario) {
        try {
            return await Usuario.findByPk(id_usuario);
        } catch (error) {
            console.error(`Erro ao buscar usuário por ID ${id_usuario}:`, error);
            throw error;
        }
    }

    static async buscarPorCpfOuEmail(cpf, email) {
        try {
            return await Usuario.findOne({
                where: {
                    [Op.or]: [{ cpf: cpf }, { email: email }]
                },
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
                where: { email: email, otpAtivo: otp }
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

    /**
     *  NOVO MÉTODO: Deleta um usuário e seus perfis associados.
     */
    static async deletarPorId(id_usuario) {
        const t = await sequelize.transaction();
        try {
            // Deleta primeiro os perfis para respeitar as chaves estrangeiras
            await Cliente.destroy({ where: { idUsuario: id_usuario }, transaction: t });
            await Funcionario.destroy({ where: { idUsuario: id_usuario }, transaction: t });

            // Depois deleta o usuário principal
            const resultado = await Usuario.destroy({ where: { id_usuario: id_usuario }, transaction: t });
            
            await t.commit();
            return resultado > 0; // Retorna true se alguma linha foi deletada
        } catch (error) {
            await t.rollback();
            console.error(`Erro ao deletar usuário com ID ${id_usuario}:`, error);
            throw error;
        }
    }
}

module.exports = UsuarioDAO;