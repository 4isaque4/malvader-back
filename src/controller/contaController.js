// src/controller/contaController.js

const sequelize = require('../util/database');
const ContaDAO = require('../dao/contaDAO');
const ClienteDAO = require('../dao/clienteDAO');
const TransacaoDAO = require('../dao/transacaoDAO');
const UsuarioDAO = require('../dao/usuarioDAO');

class ContaController {

    static async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const {
                cpfCliente,
                idAgencia,
                tipoConta,
                dadosEspecificos
            } = req.body;

            if (!cpfCliente || !idAgencia || !tipoConta || !dadosEspecificos) {
                await t.rollback();
                return res.status(400).json({ erro: 'Dados insuficientes para abrir a conta.' });
            }

            const usuario = await UsuarioDAO.buscarPorCpfOuEmail(cpfCliente, null);
            if (!usuario || !usuario.perfilCliente) {
                await t.rollback();
                return res.status(404).json({ erro: 'Cliente não encontrado com o CPF fornecido.' });
            }
            const idCliente = usuario.perfilCliente.idCliente;
            
            const numeroConta = `${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
            const dadosGerais = { idCliente, idAgencia, tipoConta, numeroConta };
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
     *  NOVO MÉTODO ADICIONADO
     * Lista todas as contas. Rota para funcionários com permissão.
     */
    static async getAll(req, res) {
        try {
            const contas = await ContaDAO.buscarTodas();
            res.status(200).json(contas);
        } catch (error) {
            console.error("Erro ao listar contas:", error);
            res.status(500).json({ erro: 'Falha ao listar contas.' });
        }
    }
    
    /**
     *  NOVO MÉTODO ADICIONADO
     * Busca os detalhes de uma conta específica pelo ID.
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const conta = await ContaDAO.buscarPorId(id);
            if (conta) {
                res.status(200).json(conta);
            } else {
                res.status(404).json({ erro: 'Conta não encontrada.' });
            }
        } catch (error) {
            console.error("Erro ao buscar conta por ID:", error);
            res.status(500).json({ erro: 'Falha ao buscar conta.' });
        }
    }

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