// src/controller/UsuarioController.js

const usuarioDAO = require('../dao/usuarioDAO');
const bcrypt = require('bcrypt');
const crypto = require('crypto'); // Módulo nativo do Node para gerar OTP seguro
const { enviarEmailOTP } = require('../helpers/emailService');

class UsuarioController {
  
  // ✅ MÉTODO ADICIONADO PARA CORRESPONDER À ROTA /listar
  static async getAll(req, res) {
    try {
      // Este método 'buscarTodos' precisa existir no seu arquivo usuarioDAO.js
      const usuarios = await usuarioDAO.buscarTodos(); 

      // É uma boa prática não expor dados sensíveis como senhas e OTPs
      const usuariosLimpados = usuarios.map(user => {
        const { senha_hash, otp_ativo, otp_expiracao, ...usuarioLimpo } = user.get({ plain: true });
        return usuarioLimpo;
      });

      res.status(200).json(usuariosLimpados);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      res.status(500).json({ erro: 'Erro interno ao buscar usuários.' });
    }
  }

  static async create(req, res) {
    // ✅ Adicionado "email" na desestruturação
    const { nome, cpf, email, data_nascimento, telefone, senha, tipo_usuario } = req.body;

    try {
      // Este método precisa existir no seu usuarioDAO.js
      const usuarioExistente = await usuarioDAO.buscarPorCpfOuEmail(cpf, email); 
      if (usuarioExistente) {
        return res.status(400).json({ erro: 'CPF ou E-mail já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      // Este método precisa existir no seu usuarioDAO.js
      const novoUsuario = await usuarioDAO.criar({ 
        nome,
        CPF: cpf,
        email,
        data_nascimento,
        telefone,
        tipo_usuario,
        senha_hash: senhaHash,
      });

      // Retornar usuário sem a senha
      const { senha_hash, ...usuarioSemSenha } = novoUsuario.get({ plain: true });
      res.status(201).json({
        mensagem: 'Usuário criado com sucesso.',
        usuario: usuarioSemSenha,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar usuário.' });
    }
  }

  // ✅ Renomeado e refatorado para usar o Banco de Dados
  static async solicitarOTP(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ erro: 'O e-mail é obrigatório.' });
    }

    try {
      // Este método precisa existir no seu usuarioDAO.js
      const usuario = await usuarioDAO.buscarPorEmail(email); 
      if (!usuario) {
        return res.status(404).json({ erro: 'Usuário não encontrado.' });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const expiracao = new Date(Date.now() + 5 * 60 * 1000); // 5 minutos de validade

      await usuario.update({ otp_ativo: otp, otp_expiracao: expiracao });

      await enviarEmailOTP(usuario.email, otp);

      res.status(200).json({ mensagem: 'OTP enviado com sucesso para o seu e-mail.' });
    } catch (error) {
      console.error('Erro ao solicitar OTP:', error);
      res.status(500).json({ erro: 'Falha ao processar a solicitação de OTP.' });
    }
  }

  //Renomeado e refatorado para usar o Banco de Dados
  static async verificarOTP(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ erro: 'E-mail e OTP são obrigatórios.' });
    }

    try {
      const usuario = await usuarioDAO.buscarPorEmail(email);
      if (!usuario || !usuario.otp_ativo) {
        return res.status(400).json({ erro: 'Nenhum OTP pendente para este usuário.' });
      }

      if (new Date() > usuario.otp_expiracao) {
        await usuario.update({ otp_ativo: null, otp_expiracao: null }); // Limpa o OTP expirado
        return res.status(400).json({ erro: 'OTP expirado. Solicite um novo.' });
      }

      if (usuario.otp_ativo !== otp) {
        return res.status(400).json({ erro: 'OTP inválido.' });
      }

      // Limpa o OTP após o sucesso para evitar reuso
      await usuario.update({ otp_ativo: null, otp_expiracao: null });

      // Aqui, você pode gerar um token JWT e logar o usuário
      res.status(200).json({ mensagem: 'OTP validado com sucesso!' });
    } catch (error) {
      console.error('Erro ao validar OTP:', error);
      res.status(500).json({ erro: 'Falha na validação do OTP.' });
    }
  }
}

module.exports = UsuarioController;
