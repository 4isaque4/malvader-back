// src/controller/clienteController.js

const sequelize = require('../util/database');
const ClienteDAO = require('../dao/clienteDAO');
const UsuarioDAO = require('../dao/UsuarioDAO');
const bcrypt = require('bcrypt');

class ClienteController {

  static async getAll(req, res) {
    try {
      const clientes = await ClienteDAO.buscarTodos(); 
      res.status(200).json(clientes);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
      res.status(500).json({ erro: 'Erro ao buscar clientes.' });
    }
  }

  static async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const { usuario, cliente } = req.body;

      // ✅ CORREÇÃO APLICADA AQUI:
      // Chamando a função correta 'buscarPorCpfOuEmail' que existe no DAO.
      const usuarioExistente = await UsuarioDAO.buscarPorCpfOuEmail(usuario.cpf, usuario.email);
      if (usuarioExistente) {
        await t.rollback();
        return res.status(400).json({ erro: 'CPF ou E-mail já cadastrado.' });
      }

      const senhaHash = await bcrypt.hash(usuario.senha, 10);

      const novoUsuario = await UsuarioDAO.criar({
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        dataNascimento: usuario.data_nascimento,
        telefone: usuario.telefone,
        tipoUsuario: 'CLIENTE',
        senhaHash: senhaHash
      }, { transaction: t });

      const novoCliente = await ClienteDAO.criar({
        idUsuario: novoUsuario.id_usuario,
        scoreCredito: cliente.scoreCredito || 0
      }, { transaction: t });

      await t.commit();

      res.status(201).json({
        mensagem: 'Cliente criado com sucesso.',
        cliente: {
          idCliente: novoCliente.idCliente,
          scoreCredito: novoCliente.scoreCredito,
          usuario: {
            idUsuario: novoUsuario.id_usuario,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            cpf: novoUsuario.cpf,
            telefone: novoUsuario.telefone
          }
        }
      });

    } catch (error) {
      await t.rollback();
      console.error('Erro ao criar cliente:', error);
      res.status(500).json({ erro: 'Erro ao criar cliente.' });
    }
  }

  static async update(req, res) {
    try {
      const { cpf } = req.params;
      const { nome, telefone, dataNascimento, scoreCredito } = req.body;

      const resultado = await ClienteDAO.atualizarPorCpf(cpf, {
        dadosUsuario: { nome, telefone, dataNascimento },
        dadosCliente: { scoreCredito }
      });

      if (!resultado) {
        return res.status(404).json({ erro: 'Cliente não encontrado.' });
      }

      res.status(200).json({
        mensagem: 'Cliente atualizado com sucesso.',
        cliente: resultado
      });
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      res.status(500).json({ erro: 'Erro ao atualizar cliente.' });
    }
  }

  static async delete(req, res) {
    try {
      const { cpf } = req.params;
      const resultado = await ClienteDAO.deletarPorCpf(cpf);

      if (!resultado) {
        return res.status(404).json({ erro: 'Cliente não encontrado.' });
      }

      res.status(200).json({ mensagem: 'Cliente deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      res.status(500).json({ erro: 'Erro ao deletar cliente.' });
    }
  }
}

module.exports = ClienteController;
