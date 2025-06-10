// src/controller/funcionarioController.js

const sequelize = require('../util/database'); // Importando a instância do Sequelize para transações
const FuncionarioDAO = require('../dao/funcionarioDAO');
const UsuarioDAO = require('../dao/usuarioDAO');
const bcrypt = require('bcrypt');

class FuncionarioController {

  static async getAll(req, res) {
    try {
      // O DAO precisa ser atualizado para buscar o funcionário junto com os dados do usuário associado.
      const funcionarios = await FuncionarioDAO.buscarTodos();
      res.status(200).json(funcionarios);
    } catch (error) {
      console.error('Erro ao buscar funcionários:', error);
      res.status(500).json({ erro: 'Erro ao buscar funcionários.' });
    }
  }

  static async create(req, res) {
    // Usando uma transação para garantir que o usuário e o funcionário sejam criados com sucesso.
    const t = await sequelize.transaction();

    try {
      const { usuario, funcionario } = req.body;

      // 1. Verificar se o CPF ou E-mail já existem
      const usuarioExistente = await UsuarioDAO.buscarPorCpfOuEmail(usuario.cpf, usuario.email);
      if (usuarioExistente) {
        await t.rollback();
        return res.status(400).json({ erro: 'CPF ou E-mail já cadastrado.' });
      }

      // 2. Criptografar a senha
      const senhaHash = await bcrypt.hash(usuario.senha, 10);

      // 3. Criar o registro de usuário dentro da transação
      // Usando as propriedades em camelCase, conforme definido nos novos modelos
      const novoUsuario = await UsuarioDAO.criar({
        nome: usuario.nome,
        cpf: usuario.cpf,
        email: usuario.email,
        dataNascimento: usuario.data_nascimento,
        telefone: usuario.telefone,
        tipoUsuario: 'FUNCIONARIO',
        senhaHash: senhaHash
      }, { transaction: t });

      // 4. Criar o registro de funcionário vinculado
      const novoFuncionario = await FuncionarioDAO.criar({
        idUsuario: novoUsuario.id_usuario, // Usando a chave correta
        codigoFuncionario: funcionario.codigo_funcionario,
        cargo: funcionario.cargo,
        idSupervisor: funcionario.id_supervisor || null
      }, { transaction: t });

      // 5. Se tudo correu bem, confirmar a transação
      await t.commit();

      // 6. Retornar a resposta com a estrutura de dados atualizada
      res.status(201).json({
        mensagem: 'Funcionário criado com sucesso.',
        funcionario: {
          idFuncionario: novoFuncionario.idFuncionario,
          codigoFuncionario: novoFuncionario.codigoFuncionario,
          cargo: novoFuncionario.cargo,
          idSupervisor: novoFuncionario.idSupervisor,
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
      // Se algo deu errado, reverter todas as operações
      await t.rollback();
      console.error('Erro ao criar funcionário:', error);
      res.status(500).json({ erro: 'Erro ao criar funcionário.' });
    }
  }

  static async update(req, res) {
    try {
      const { cpf } = req.params; // Identifica o funcionário pelo CPF do usuário
      const { nome, telefone, dataNascimento, cargo, idSupervisor } = req.body;

      // O DAO deve ser atualizado para lidar com a atualização em tabelas associadas
      const resultado = await FuncionarioDAO.atualizarPorCpf(cpf, {
        dadosUsuario: { nome, telefone, dataNascimento },
        dadosFuncionario: { cargo, idSupervisor }
      });

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
      
      // O DAO deve conter a lógica para encontrar e deletar o funcionário e o usuário associado em uma transação.
      const resultado = await FuncionarioDAO.deletarPorCpf(cpf);

      if (!resultado) {
        return res.status(404).json({ erro: 'Funcionário não encontrado.' });
      }

      res.status(200).json({ mensagem: 'Funcionário deletado com sucesso.' });
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      res.status(500).json({ erro: 'Erro ao deletar funcionário.' });
    }
  }
}

module.exports = FuncionarioController;
