// src/model/Transacao.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Transacao extends Model {}

Transacao.init({
  idTransacao: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_transacao'
  },
  idContaOrigem: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_conta_origem'
  },
  idContaDestino: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_conta_destino'
  },
  tipoTransacao: {
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

  idUsuarioOperador: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario_operador'
  },
}, {
  sequelize,
  modelName: 'Transacao',
  tableName: 'transacao',
  timestamps: false,
  underscored: true
});

module.exports = Transacao;