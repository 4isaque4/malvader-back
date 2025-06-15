// src/dao/enderecoDAO.js

const Endereco = require('../model/endereco');

class EnderecoDAO {
    /**
     * Cria um novo endereço no banco de dados.
     * @param {object} dadosEndereco - Os dados do endereço.
     * @param {object} options - Opções adicionais, como a transação.
     * @returns {Promise<Endereco>}
     */
    static async criar(dadosEndereco, options = {}) {
        try {
            return await Endereco.create(dadosEndereco, options);
        } catch (error) {
            console.error("Erro ao criar endereço:", error);
            throw error;
        }
    }
}

module.exports = EnderecoDAO;