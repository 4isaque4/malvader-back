const ClienteDAO = require('../dao/clienteDAO');
const usuarioDAO = require('../dao/usuarioDAO');
const bcrypt = require('bcrypt');
class ClienteController {
  
  static async getAll(req, res) {
    try {
      const clientes = await ClienteDAO.buscarTodos();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao busca usuários.' });
    }
  }
static async create(req, res) {

    const { usuario, cliente } = req.body;
    try {
      // Verificar se CPF já existe
      const cpf = usuario.cpf;
      const CPF = await usuarioDAO.buscarPorCpf(cpf);
      if (CPF) {
        return res.status(400).json({ erro: 'CPF já cadastrado' });
      }

      // Criptografar senha
      const senhaHash = await bcrypt.hash(usuario.senha, 10);

      // Criar usuário
      const novoUsuario = await usuarioDAO.criar({
        nome: usuario.nome,
        CPF: usuario.cpf,
        data_nascimento: usuario.data_nascimento,
        telefone: usuario.telefone,
        tipo_usuario: 'CLIENTE',
        senha_hash: senhaHash
      });

      // Criar cliente vinculado
      const novoCliente = await ClienteDAO.criar({
        score_credito: cliente.score_credito || 0,
        Usuario_idUsuario: novoUsuario.idUsuario
      });

      res.status(201).json({
        mensagem: 'Cliente criado com sucesso',
        cliente: {
          id_cliente: novoCliente.id_cliente,
          score_credito: novoCliente.score_credito,
          usuario: {
            idUsuario: novoUsuario.idUsuario,
            nome: novoUsuario.nome,
            cpf: novoUsuario.cpf,
            telefone: novoUsuario.telefone
          }
        }
      });

    } catch (error) {
      console.error(error);
      res.status(500).json({ erro: 'Erro ao criar cliente' });
    }
  }

static async update(req, res) {
  try {
    const { cpf } = req.params;

    const {
      nome,
      telefone,
      data_nascimento,
      score_credito
    } = req.body;

    const dadosUsuario = { nome, telefone, data_nascimento };
    const dadosCliente = { score_credito };

    const resultado = await ClienteDAO.atualizar(cpf, dadosUsuario, dadosCliente);

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

    const resultado = await ClienteDAO.deletar(cpf);

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