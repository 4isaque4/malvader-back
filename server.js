// server.js
const express = require('express');
const cors = require('cors');
const banco = require('./src/util/database');
require('dotenv').config();
require('./src/model/associacoes'); // Corrigido para o nome do arquivo correto
const { verificarConexaoEmail } = require('./src/helpers/emailService')

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

// Importação das rotas
const usuarioRoutes = require('./view/routes/usuarioRoutes');
const clienteRoutes = require('./view/routes/clienteRoutes');
const funcionarioRoutes = require('./view/routes/funcionarioRoutes');
const relatorioRoutes = require('./view/routes/relatorioRoutes');
const agenciaRoutes = require('./view/routes/agenciaRoutes');
const transacaoRoutes = require('./view/routes/transacaoRoutes'); // Adicionada a rota de transação
const contaRoutes = require('./view/routes/contaRoutes');

// Uso das rotas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/funcionarios', funcionarioRoutes);
app.use('/api/relatorios', relatorioRoutes);
app.use('/api/agencias', agenciaRoutes);
app.use('/api/transacoes', transacaoRoutes); // Adicionada a rota de transação
app.use('/api/contas', contaRoutes);


app.get('/', (req, res) => {
    res.send('API Banco Rodando 🚀');
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ message: 'Rota não encontrada' });
});

// Inicialização do servidor
app.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  try {
    await banco.authenticate();
    console.log('Conexão com o banco de dados estabelecida com sucesso!');
    await verificarConexaoEmail();
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
});