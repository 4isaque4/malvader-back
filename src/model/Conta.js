// src/model/Conta.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Conta extends Model {}

Conta.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idConta: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_conta'
  },
  idCliente: { // CORRIGIDO: A conta agora pertence a um cliente.
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_cliente'
  },
  idAgencia: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_agencia'
  },
  numeroConta: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'numero_conta'
  },
  saldo: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'saldo'
  },
  tipoConta: {
    type: DataTypes.ENUM('POUPANCA', 'CORRENTE', 'INVESTIMENTO'), // ATUALIZADO para ENUM
    allowNull: false,
    field: 'tipo_conta'
  },
  dataAbertura: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_abertura'
  },
  status: {
    type: DataTypes.ENUM('ATIVA', 'ENCERRADA', 'BLOQUEADA'), // ATUALIZADO para ENUM
    allowNull: false,
    defaultValue: 'ATIVA',
    field: 'status'
  },
}, {
  sequelize,
  modelName: 'Conta',
  tableName: 'conta',
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
  const Cliente = require('./Cliente');
  const Agencia = require('./Agencia');
  
  // Uma Conta pertence a um Cliente.
  Conta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });
  // Um Cliente pode ter várias Contas.
  Cliente.hasMany(Conta, { foreignKey: 'id_cliente', as: 'contas' });

  // Uma Conta pertence a uma Agencia.
  Conta.belongsTo(Agencia, { foreignKey: 'id_agencia', as: 'agencia' });
  // Uma Agencia pode ter várias Contas.
  Agencia.hasMany(Conta, { foreignKey: 'id_agencia', as: 'contas' });

*/

module.exports = Conta;
