const sequelize = require('../util/database');
const { QueryTypes } = require('sequelize');

class RelatorioDAO {

    /**
     * Busca os dados da view de movimentações recentes.
     * @returns {Promise<Array<object>>}
     */
    static async buscarMovimentacoesRecentes() {
        try {
            // Usamos uma query bruta (raw query) porque estamos consultando uma VIEW,
            // que não possui um modelo Sequelize associado diretamente.
            const resultados = await sequelize.query("SELECT * FROM vw_movimentacoes_recentes", {
                type: QueryTypes.SELECT
            });
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar movimentações recentes:", error);
            throw error;
        }
    }

    /**
     * Busca os dados da view de resumo de contas por cliente.
     * @returns {Promise<Array<object>>}
     */
    static async buscarResumoContas() {
        try {
            const resultados = await sequelize.query("SELECT * FROM vw_resumo_contas", {
                type: QueryTypes.SELECT
            });
            return resultados;
        } catch (error) {
            console.error("Erro ao buscar resumo de contas:", error);
            throw error;
        }
    }
    
    // Você pode adicionar outros métodos aqui para os outros relatórios
    // static async buscarClientesInadimplentes() { ... }
}

module.exports = RelatorioDAO;