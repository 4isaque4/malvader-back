// src/controller/usuarioController.js

// Imports necessários para todas as funcionalidades do controller
const UsuarioDAO = require('../dao/usuarioDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const { enviarEmailOTP } = require('../helpers/emailService');


class UsuarioController {
  
  static async getAll(req, res) {
    try {
      const usuarios = await UsuarioDAO.buscarTodos(); 
      const usuariosLimpados = usuarios.map(user => {
        const { senhaHash, otpAtivo, otpExpiracao, ...usuarioLimpo } = user.get({ plain: true });
        return usuarioLimpo;
      });
      res.status(200).json(usuariosLimpados);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar usuários.' });
    }
  }

  static async solicitarOTP(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ erro: 'O e-mail é obrigatório.' });
    }
    try {
      const usuario = await UsuarioDAO.buscarPorEmail(email); 
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }
      const otp = crypto.randomInt(100000, 999999).toString();
      const expiracao = new Date(Date.now() + 5 * 60 * 1000);
      await usuario.update({ otpAtivo: otp, otpExpiracao: expiracao });
      await enviarEmailOTP(usuario.email, otp);
      res.status(200).json({ mensagem: 'OTP enviado com sucesso para o seu e-mail.' });
    } catch (error) {
      console.error('Erro ao solicitar OTP:', error);
      res.status(500).json({ erro: 'Falha ao processar a solicitação de OTP.' });
    }
  }
  
  static async verificarOTP(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ erro: 'E-mail e OTP são obrigatórios.' });
    }
    try {
      const usuario = await UsuarioDAO.buscarPorEmailEOTP(email, otp);
      if (!usuario) {
        return res.status(400).json({ erro: 'OTP inválido ou e-mail não encontrado.' });
      }
      if (new Date() > usuario.otpExpiracao) {
        await usuario.update({ otpAtivo: null, otpExpiracao: null });
        return res.status(400).json({ erro: 'OTP expirado. Solicite um novo.' });
      }
      await usuario.update({ otpAtivo: null, otpExpiracao: null });
      res.status(200).json({ mensagem: 'OTP validado com sucesso!' });
    } catch (error) {
      console.error('Erro ao validar OTP:', error);
      res.status(500).json({ erro: 'Falha na validação do OTP.' });
    }
  }

  // ✅ NOVO MÉTODO DE LOGIN
  static async login(req, res) {
    try {
        const { email, senha } = req.body;
        if (!email || !senha) {
            return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
        }

        // Usando a variável correta importada no topo do arquivo
        const usuario = await UsuarioDAO.buscarPorEmail(email);
        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado.' });
        }

        const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Senha inválida.' });
        }
        
        let cargo = null;
        if(usuario.tipoUsuario === 'FUNCIONARIO') {
            // Usa a associação 'perfilFuncionario' para obter o perfil e o cargo
            const funcionario = await usuario.getPerfilFuncionario(); 
            if(funcionario) cargo = funcionario.cargo;
        }

        const payload = {
            id_usuario: usuario.id_usuario,
            tipo_usuario: usuario.tipoUsuario,
            cargo: cargo 
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION || '1d' });

        res.status(200).json({ mensagem: 'Login bem-sucedido!', token });

    } catch (error) {
        console.error("Erro no login:", error);
        res.status(500).json({ erro: 'Falha no login.' });
    }
  }
}

module.exports = UsuarioController;