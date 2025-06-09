// server.js
const express = require('express');
const cors = require('cors');
const banco = require('./src/util/database');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

const usuarioRoutes = require('./view/routes/usuarioRoutes');
app.use('/api/usuarios', usuarioRoutes);

const clienteRoutes = require('./view/routes/clienteRoutes');
app.use('/api/clientes', clienteRoutes);

const funcionarioRoutes = require('./view/routes/funcionarioRoutes');
app.use('/api/funcionarios', funcionarioRoutes);


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
  } catch (error) {
    console.error('Erro ao conectar com o banco de dados:', error);
  }
});