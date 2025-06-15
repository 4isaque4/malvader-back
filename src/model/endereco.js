// src/model/Endereco.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Endereco extends Model {}

Endereco.init({
  idEndereco: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_endereco'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: true, 
    field: 'id_usuario'
  },
  cep: {
    type: DataTypes.STRING(10),
    allowNull: false,
    field: 'cep'
  },
  local: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'local'
  },
  numeroCasa: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'numero_casa'
  },
  bairro: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'bairro'
  },
  cidade: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'cidade'
  },
  estado: {
    type: DataTypes.CHAR(2),
    allowNull: false,
    field: 'estado'
  },
  complemento: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'complemento'
  },
}, {
  sequelize,
  modelName: 'Endereco',
  tableName: 'endereco',
  timestamps: false,
  underscored: true
});

module.exports = Endereco;
