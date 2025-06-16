// src/controller/usuarioController.js

const UsuarioDAO = require('../dao/UsuarioDAO');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config();
const { enviarEmailOTP } = require('../helpers/emailService');
const gerarToken = require('../helpers/gerarToken');

class UsuarioController {
  
    // ... métodos getAll, solicitarOTP, verificarOTP, login ...

    static async login(req, res) {
        try {
            const { email, senha } = req.body;
            if (!email || !senha) {
                return res.status(400).json({ erro: 'E-mail e senha são obrigatórios.' });
            }
            const usuario = await UsuarioDAO.buscarPorEmail(email);
            if (!usuario) {
                return res.status(401).json({ erro: 'Credenciais inválidas.' });
            }
            const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Credenciais inválidas.' });
            }
            let cargo = null;
            if (usuario.tipoUsuario === 'FUNCIONARIO' && usuario.perfilFuncionario) {
                cargo = usuario.perfilFuncionario.cargo;
            }
            const payload = {
                id_usuario: usuario.id_usuario,
                tipo_usuario: usuario.tipoUsuario,
                cargo: cargo
            };
            const token = gerarToken(payload);
            res.status(200).json({ mensagem: 'Login bem-sucedido!', token });
        } catch (error) {
            console.error("Erro no login:", error);
            res.status(500).json({ erro: 'Falha no login.' });
        }
    }

    /**
     * ✅ NOVO MÉTODO: Permite que um usuário logado altere o próprio e-mail.
     */
    static async alterarEmail(req, res) {
        try {
            const id_usuario_logado = req.usuario.id_usuario;
            const { novoEmail, senha } = req.body;

            if (!novoEmail || !senha) {
                return res.status(400).json({ erro: 'O novo e-mail e a sua senha atual são obrigatórios.' });
            }
            
            // Verifica se o novo e-mail já está em uso
            const emailExistente = await UsuarioDAO.buscarPorEmail(novoEmail);
            if (emailExistente) {
                return res.status(400).json({ erro: 'Este e-mail já está em uso por outra conta.' });
            }

            const usuario = await UsuarioDAO.buscarPorId(id_usuario_logado);
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            // Confirma a identidade do usuário verificando a senha atual
            const senhaValida = await bcrypt.compare(senha, usuario.senhaHash);
            if (!senhaValida) {
                return res.status(401).json({ erro: 'Senha incorreta. Alteração de e-mail não autorizada.' });
            }

            await usuario.update({ email: novoEmail });

            res.status(200).json({ mensagem: 'E-mail alterado com sucesso!' });

        } catch (error) {
            console.error("Erro ao alterar e-mail:", error);
            res.status(500).json({ erro: 'Falha ao alterar e-mail.' });
        }
    }

    static async alterarSenha(req, res) {
        try {
            const id_usuario_logado = req.usuario.id_usuario;
            const { senhaAntiga, novaSenha } = req.body;

            if (!senhaAntiga || !novaSenha) {
                return res.status(400).json({ erro: 'A senha antiga e a nova senha são obrigatórias.' });
            }

            const usuario = await UsuarioDAO.buscarPorId(id_usuario_logado);
            if (!usuario) {
                return res.status(404).json({ erro: 'Usuário não encontrado.' });
            }

            const senhaAntigaValida = await bcrypt.compare(senhaAntiga, usuario.senhaHash);
            if (!senhaAntigaValida) {
                return res.status(401).json({ erro: 'Senha antiga incorreta.' });
            }
            
            if (novaSenha.length < 8) {
                 return res.status(400).json({ erro: 'A nova senha deve ter pelo menos 8 caracteres.' });
            }
            
            const novaSenhaHash = await bcrypt.hash(novaSenha, 10);
            await usuario.update({ senhaHash: novaSenhaHash });

            res.status(200).json({ mensagem: 'Senha alterada com sucesso!' });

        } catch (error) {
            console.error("Erro ao alterar senha:", error);
            res.status(500).json({ erro: 'Falha ao alterar senha.' });
        }
    }

    static async deletarUsuarioPorAdmin(req, res) {
        try {
            const { cpf } = req.params;
            const usuarioParaDeletar = await UsuarioDAO.buscarPorCpfOuEmail(cpf, null);

            if (!usuarioParaDeletar) {
                return res.status(404).json({ erro: 'Usuário não encontrado com o CPF fornecido.' });
            }

            await UsuarioDAO.deletarPorId(usuarioParaDeletar.id_usuario);
            res.status(200).json({ mensagem: `Usuário com CPF ${cpf} deletado com sucesso.` });

        } catch (error) {
            console.error("Erro ao deletar usuário por admin:", error);
            res.status(500).json({ erro: 'Falha ao deletar usuário.' });
        }
    }
}

module.exports = UsuarioController;