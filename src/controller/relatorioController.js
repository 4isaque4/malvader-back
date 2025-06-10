const RelatorioDAO = require('../dao/relatorioDAO');
const { exportarParaExcel, exportarParaPDF } = require('../helpers/exportarRelatorios'); // Caminho para seu helper

class RelatorioController {

    static async gerarRelatorioMovimentacoes(req, res) {
        try {
            const dados = await RelatorioDAO.buscarMovimentacoesRecentes();

            if (!dados || dados.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhuma movimentação encontrada para gerar o relatório.' });
            }

            // Gera ambos os formatos como exemplo
            await exportarParaExcel(dados, 'relatorio_movimentacoes');
            exportarParaPDF(dados, 'relatorio_movimentacoes');

            res.status(200).json({ mensagem: 'Relatório de movimentações gerado com sucesso na pasta do projeto!' });

        } catch (error) {
            console.error("Erro no controller ao gerar relatório de movimentações:", error);
            res.status(500).json({ erro: 'Falha ao gerar relatório.' });
        }
    }

    static async gerarRelatorioResumoContas(req, res) {
        try {
            const dados = await RelatorioDAO.buscarResumoContas();

            if (!dados || dados.length === 0) {
                return res.status(404).json({ mensagem: 'Nenhum dado encontrado para gerar o relatório.' });
            }

            const nomeArquivo = 'relatorio_resumo_contas';
            await exportarParaExcel(dados, nomeArquivo);
            exportarParaPDF(dados, nomeArquivo);

            res.status(200).json({ mensagem: 'Relatório de resumo de contas gerado com sucesso na pasta do projeto!' });

        } catch (error) {
            console.error("Erro no controller ao gerar relatório de resumo de contas:", error);
            res.status(500).json({ erro: 'Falha ao gerar relatório.' });
        }
    }
}

module.exports = RelatorioController;