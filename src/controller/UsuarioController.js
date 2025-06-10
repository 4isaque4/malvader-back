// src/controller/usuarioController.js

const usuarioDAO = require('../dao/usuarioDAO');
const crypto = require('crypto');
const { enviarEmailOTP } = require('../helpers/emailService');

class UsuarioController {
  
  static async getAll(req, res) {
    try {
      const usuarios = await usuarioDAO.buscarTodos(); 
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
      const usuario = await usuarioDAO.buscarPorEmail(email); 
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const expiracao = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos de validade
      
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
      // 1. Usa o novo método para buscar pelo e-mail E pelo OTP ao mesmo tempo.
      const usuario = await usuarioDAO.buscarPorEmailEOTP(email, otp);

      // 2. Se não encontrar, o OTP está inválido ou o e-mail não existe.
      if (!usuario) {
        return res.status(400).json({ erro: 'OTP inválido ou e-mail não encontrado.' });
      }

      // 3. Verifica se o OTP encontrado não expirou.
      if (new Date() > usuario.otpExpiracao) {
        await usuario.update({ otpAtivo: null, otpExpiracao: null });
        return res.status(400).json({ erro: 'OTP expirado. Solicite um novo.' });
      }

      // 4. Limpa o OTP após o sucesso para evitar reuso.
      await usuario.update({ otpAtivo: null, otpExpiracao: null });

      res.status(200).json({ mensagem: 'OTP validado com sucesso!' });
    } catch (error) {
      console.error('Erro ao validar OTP:', error);
      res.status(500).json({ erro: 'Falha na validação do OTP.' });
    }
  }
}

module.exports = UsuarioController;
