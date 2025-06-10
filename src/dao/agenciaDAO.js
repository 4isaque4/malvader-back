// src/dao/agenciaDAO.js

const Agencia = require('../model/Agencia');
const Endereco = require('../model/Endereco');

class AgenciaDAO {
    /**
     * Cria um novo registro de agência.
     * @param {object} dadosAgencia - Dados para criar a agência.
     * @param {object} options - Opções adicionais, como a transação.
     * @returns {Promise<Agencia>}
     */
    static async criar(dadosAgencia, options = {}) {
        try {
            return await Agencia.create(dadosAgencia, options);
        } catch (error) {
            console.error("Erro ao criar agência:", error);
            throw error;
        }
    }

    /**
     * Busca todas as agências e inclui o endereço associado.
     * @returns {Promise<Array<Agencia>>}
     */
    static async buscarTodos() {
        try {
            return await Agencia.findAll({
                include: { model: Endereco, as: 'endereco' }
            });
        } catch (error) {
            console.error("Erro ao buscar todas as agências:", error);
            throw error;
        }
    }

    /**
     * Busca uma agência pelo seu ID, incluindo o endereço.
     * @param {number} id
     * @returns {Promise<Agencia|null>}
     */
    static async buscarPorId(id) {
        try {
            return await Agencia.findByPk(id, {
                include: { model: Endereco, as: 'endereco' }
            });
        } catch (error) {
            console.error(`Erro ao buscar agência por ID ${id}:`, error);
            throw error;
        }
    }
}

module.exports = AgenciaDAO;