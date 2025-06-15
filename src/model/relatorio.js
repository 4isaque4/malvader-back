// src/model/Relatorio.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Relatorio extends Model {}

Relatorio.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idRelatorio: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_relatorio'
  },
  idFuncionario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_funcionario'
  },
  tipoRelatorio: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'tipo_relatorio'
  },
  dataGeracao: {
    type: DataTypes.DATE, // Sequelize mapeia TIMESTAMP para DATE
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_geracao'
  },
  conteudo: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'conteudo'
  },
}, {
  sequelize,
  modelName: 'Relatorio',
  tableName: 'relatorio',
  timestamps: false,
  underscored: true
});



module.exports = Relatorio;
