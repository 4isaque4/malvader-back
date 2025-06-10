// src/model/Transacao.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Transacao extends Model {}

Transacao.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idTransacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_transacao'
  },
  idContaOrigem: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permite nulo (ex: em um depósito, não há origem interna)
    field: 'id_conta_origem'
  },
  idContaDestino: {
    type: DataTypes.INTEGER,
    allowNull: true, // Permite nulo (ex: em um saque, não há destino interno)
    field: 'id_conta_destino'
  },
  tipoTransacao: {
    // Valores do ENUM atualizados para corresponder ao novo banco de dados.
    type: DataTypes.ENUM('DEPOSITO', 'SAQUE', 'TRANSFERENCIA', 'TAXA', 'RENDIMENTO'),
    allowNull: false,
    field: 'tipo_transacao'
  },
  valor: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'valor'
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_hora'
  },
  descricao: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'descricao'
  },
}, {
  sequelize,
  modelName: 'Transacao',
  tableName: 'transacao',
  timestamps: false,
  underscored: true
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js')
  depois que todos os modelos forem importados.

  Exemplo de como ficaria nesse arquivo central:

  const Conta = require('./Conta');
  const Transacao = require('./Transacao');

  // Uma transação pode ter uma conta de origem.
  Transacao.belongsTo(Conta, { foreignKey: 'id_conta_origem', as: 'contaOrigem' });
  // Uma conta pode ser a origem de muitas transações.
  Conta.hasMany(Transacao, { foreignKey: 'id_conta_origem', as: 'transacoesEnviadas' });

  // Uma transação pode ter uma conta de destino.
  Transacao.belongsTo(Conta, { foreignKey: 'id_conta_destino', as: 'contaDestino' });
  // Uma conta pode ser o destino de muitas transações.
  Conta.hasMany(Transacao, { foreignKey: 'id_conta_destino', as: 'transacoesRecebidas' });

*/

module.exports = Transacao;
