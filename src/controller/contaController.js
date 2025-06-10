// src/controller/contaController.js

const sequelize = require('../util/databasee');
const ContaDAO = require('../dao/contaDAOO');
const ClienteDAO = require('../dao/clienteDAO');
const TransacaoDAO = require('../dao/TransacaoDAO');
const UsuarioDAO = require('../dao/usuarioDAO'); // Necessário para buscar o cliente por CPF

class ContaController {

  /**
   * Abre uma nova conta para um cliente existente.
   * Esta operação é transacional.
   */
  static async create(req, res) {
    const t = await sequelize.transaction();
    try {
      const {
        cpfCliente,       // CPF do cliente para quem a conta será aberta
        idAgencia,        // ID da agência
        tipoConta,        // 'CORRENTE', 'POUPANCA', ou 'INVESTIMENTO'
        dadosEspecificos  // Objeto com os dados para o tipo de conta (limite, taxa, etc.)
      } = req.body;

      // 1. Validação dos dados de entrada
      if (!cpfCliente || !idAgencia || !tipoConta || !dadosEspecificos) {
        await t.rollback();
        return res.status(400).json({ erro: 'Dados insuficientes para abrir a conta.' });
      }

      // 2. Encontrar o cliente pelo CPF
      const usuario = await UsuarioDAO.buscarPorCpfOuEmail(cpfCliente, null);
      if (!usuario || !usuario.perfilCliente) {
        await t.rollback();
        return res.status(404).json({ erro: 'Cliente não encontrado com o CPF fornecido.' });
      }
      const idCliente = usuario.perfilCliente.idCliente;
      
      // 3. Gerar um número de conta único (lógica de exemplo)
      const numeroConta = `${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;

      // 4. Montar os dados para o DAO
      const dadosGerais = { idCliente, idAgencia, tipoConta, numeroConta };

      // 5. Chamar o DAO para criar a conta e seu registro específico dentro da transação
      const novaConta = await ContaDAO.criar(dadosGerais, dadosEspecificos, { transaction: t });

      await t.commit();
      res.status(201).json(novaConta);

    } catch (error) {
      await t.rollback();
      console.error('Erro ao abrir conta:', error);
      res.status(500).json({ erro: `Falha ao abrir conta: ${error.message}` });
    }
  }

  /**
   * Realiza um depósito em uma conta.
   */
  static async realizarDeposito(req, res) {
    const t = await sequelize.transaction();
    try {
      const { numeroConta, valor } = req.body;
      if (!numeroConta || !valor || valor <= 0) {
        await t.rollback();
        return res.status(400).json({ erro: 'Número da conta e valor (positivo) são obrigatórios.' });
      }

      const contaDestino = await ContaDAO.buscarPorNumeroConta(numeroConta);
      if (!contaDestino) {
        await t.rollback();
        return res.status(404).json({ erro: 'Conta de destino não encontrada.' });
      }

      const dadosTransacao = {
        idContaDestino: contaDestino.idConta,
        valor,
        tipoTransacao: 'DEPOSITO',
        descricao: `Depósito na conta ${numeroConta}`
      };

      const transacaoCompleta = await TransacaoDAO.criar(dadosTransacao, { transaction: t });

      await t.commit();
      res.status(200).json({ mensagem: 'Depósito realizado com sucesso!', transacao: transacaoCompleta });

    } catch (error) {
      await t.rollback();
      console.error('Erro ao realizar depósito:', error);
      res.status(500).json({ erro: `Falha no depósito: ${error.message}` });
    }
  }

  /**
   * Realiza um saque de uma conta.
   */
  static async realizarSaque(req, res) {
    const t = await sequelize.transaction();
    try {
      const { numeroConta, valor } = req.body;
      if (!numeroConta || !valor || valor <= 0) {
        await t.rollback();
        return res.status(400).json({ erro: 'Número da conta e valor (positivo) são obrigatórios.' });
      }
      
      const contaOrigem = await ContaDAO.buscarPorNumeroConta(numeroConta);
      if (!contaOrigem) {
        await t.rollback();
        return res.status(404).json({ erro: 'Conta de origem não encontrada.' });
      }

      const dadosTransacao = {
        idContaOrigem: contaOrigem.idConta,
        valor,
        tipoTransacao: 'SAQUE',
        descricao: `Saque da conta ${numeroConta}`
      };

      const transacaoCompleta = await TransacaoDAO.criar(dadosTransacao, { transaction: t });

      await t.commit();
      res.status(200).json({ mensagem: 'Saque realizado com sucesso!', transacao: transacaoCompleta });

    } catch (error) {
      await t.rollback();
      console.error('Erro ao realizar saque:', error);
      res.status(500).json({ erro: `Falha no saque: ${error.message}` });
    }
  }

  /**
   * Realiza uma transferência entre duas contas.
   */
  static async realizarTransferencia(req, res) {
    const t = await sequelize.transaction();
    try {
        const { numeroContaOrigem, numeroContaDestino, valor } = req.body;
        if (!numeroContaOrigem || !numeroContaDestino || !valor || valor <= 0) {
            await t.rollback();
            return res.status(400).json({ erro: 'Contas de origem, destino e valor (positivo) são obrigatórios.' });
        }

        const contaOrigem = await ContaDAO.buscarPorNumeroConta(numeroContaOrigem);
        const contaDestino = await ContaDAO.buscarPorNumeroConta(numeroContaDestino);

        if (!contaOrigem || !contaDestino) {
            await t.rollback();
            return res.status(404).json({ erro: 'Uma ou ambas as contas não foram encontradas.' });
        }

        const dadosTransacao = {
            idContaOrigem: contaOrigem.idConta,
            idContaDestino: contaDestino.idConta,
            valor,
            tipoTransacao: 'TRANSFERENCIA',
            descricao: `Transferência de ${numeroContaOrigem} para ${numeroContaDestino}`
        };

        const transacaoCompleta = await TransacaoDAO.criar(dadosTransacao, { transaction: t });

        await t.commit();
        res.status(200).json({ mensagem: 'Transferência realizada com sucesso!', transacao: transacaoCompleta });

    } catch (error) {
        await t.rollback();
        console.error('Erro ao realizar transferência:', error);
        res.status(500).json({ erro: `Falha na transferência: ${error.message}` });
    }
  }

  /**
   * Busca e retorna o extrato de uma conta.
   */
  static async getExtrato(req, res) {
    try {
        const { numeroConta } = req.params;
        const conta = await ContaDAO.buscarPorNumeroConta(numeroConta);

        if (!conta) {
            return res.status(404).json({ erro: 'Conta não encontrada.' });
        }

        const extrato = await TransacaoDAO.buscarExtratoDaConta(conta.idConta);

        res.status(200).json(extrato);
    } catch (error) {
        console.error('Erro ao buscar extrato:', error);
        res.status(500).json({ erro: `Falha ao buscar extrato: ${error.message}` });
    }
  }

}

module.exports = ContaController;
