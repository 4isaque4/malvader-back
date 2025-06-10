// src/controller/agenciaController.js

const sequelize = require('../util/database');
const AgenciaDAO = require('../dao/agenciaDAO');
const EnderecoDAO = require('../dao/enderecoDAO');

class AgenciaController {
    static async create(req, res) {
        const t = await sequelize.transaction();
        try {
            const { agencia, endereco } = req.body;

            if (!agencia || !endereco) {
                await t.rollback();
                return res.status(400).json({ erro: 'Dados da agência e do endereço são obrigatórios.' });
            }

            // 1. Cria o endereço dentro da transação
            const novoEndereco = await EnderecoDAO.criar(endereco, { transaction: t });

            // 2. Usa o ID do novo endereço para criar a agência
            const dadosAgencia = {
                ...agencia,
                idEndereco: novoEndereco.idEndereco
            };
            const novaAgencia = await AgenciaDAO.criar(dadosAgencia, { transaction: t });

            await t.commit();
            
            const agenciaCompleta = await AgenciaDAO.buscarPorId(novaAgencia.idAgencia);
            res.status(201).json(agenciaCompleta);

        } catch (error) {
            await t.rollback();
            console.error("Erro no controller ao criar agência:", error);
            res.status(500).json({ erro: `Falha ao criar agência: ${error.message}` });
        }
    }

    static async getAll(req, res) {
        try {
            const agencias = await AgenciaDAO.buscarTodos();
            res.status(200).json(agencias);
        } catch (error) {
            console.error("Erro ao listar agências:", error);
            res.status(500).json({ erro: 'Falha ao listar agências.' });
        }
    }

    static async getById(req, res) {
        try {
            const { id } = req.params;
            const agencia = await AgenciaDAO.buscarPorId(id);
            if (agencia) {
                res.status(200).json(agencia);
            } else {
                res.status(404).json({ erro: 'Agência não encontrada.' });
            }
        } catch (error) {
            console.error("Erro ao buscar agência por ID:", error);
            res.status(500).json({ erro: 'Falha ao buscar agência.' });
        }
    }
}

module.exports = AgenciaController;