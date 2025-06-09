const FuncionarioDAO = require('../dao/funcionarioDAO');
const usuarioDAO = require('../dao/usuarioDAO');
const bcrypt = require('bcrypt');
class FuncionarioController {
  static async getAll(req, res) {
    try {
      const funcionarios = await FuncionarioDAO.buscarTodos();
      res.json(funcionarios);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao busca funcionario.' });
    }
  }
static async create(req, res) {
  const { usuario, funcionario } = req.body;

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
      tipo_usuario: 'FUNCIONARIO',
      senha_hash: senhaHash
    });

    // Criar funcionário vinculado
    const novoFuncionario = await FuncionarioDAO.criar({
      codigo_funcionario: funcionario.codigo_funcionario,
      cargo: funcionario.cargo,
      id_supervisor: funcionario.id_supervisor || null,
      id_usuario: novoUsuario.idUsuario,
      ...(funcionario.id_supervisor && { id_supervisor: funcionario.id_supervisor }),
      // Se tiver código, adicione aqui se o seu model usar:
      ...(funcionario.codigo_funcionario && { codigo_funcionario: funcionario.codigo_funcionario })
    });

    res.status(201).json({
      mensagem: 'Funcionário criado com sucesso',
      funcionario: {
        id_funcionario: novoFuncionario.id_funcionario,
        codigo_funcionario: novoFuncionario.codigo_funcionario,
        cargo: novoFuncionario.cargo,
        id_supervisor: novoFuncionario.id_supervisor,
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
    res.status(500).json({ erro: 'Erro ao criar funcionário' });
  }
}
static async update(req, res) {
  try {
    const { cpf } = req.params;

    const {
      nome,
      telefone,
      data_nascimento,
      cargo,
      salario,
      data_admissao,
      id_supervisor
    } = req.body;

    const dadosUsuario = { nome, telefone, data_nascimento };
    const dadosFuncionario = { cargo, salario, data_admissao, id_supervisor };

    const resultado = await FuncionarioDAO.atualizar(cpf, dadosUsuario, dadosFuncionario);

    if (!resultado) {
      return res.status(404).json({ erro: 'Funcionário não encontrado.' });
    }

    res.status(200).json({
      mensagem: 'Funcionário atualizado com sucesso.',
      funcionario: resultado
    });
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error);
    res.status(500).json({ erro: 'Erro ao atualizar funcionário.' });
  }
}

static async delete(req, res) {
  try {
    const { cpf } = req.params;

    const resultado = await FuncionarioDAO.deletar(cpf);

    if (!resultado) {
      return res.status(404).json({ erro: 'Funcionario não encontrado.' });
    }

    res.status(200).json({ mensagem: 'Funcionario deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar Funcionario:', error);
    res.status(500).json({ erro: 'Erro ao deletar Funcionario.' });
  }
}

}
module.exports = FuncionarioController;