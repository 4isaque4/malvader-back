// src/model/Funcionario.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Funcionario extends Model {}

Funcionario.init({
  // Em JS, usamos camelCase para as propriedades (ex: idFuncionario)
  // e mapeamos para o banco de dados com 'field'.
  idFuncionario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_funcionario'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario',
  },
  codigoFuncionario: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true,
    field: 'codigo_funcionario'
  },
  cargo: {
    type: DataTypes.ENUM('ESTAGIARIO', 'ATENDENTE', 'GERENTE'),
    allowNull: false,
    field: 'cargo'
  },
  idSupervisor: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_supervisor'
  }
}, {
  sequelize,
  modelName: 'Funcionario',
  tableName: 'funcionario',
  timestamps: false,
  underscored: true
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js'
  ou 'src/util/database.js') depois que todos os modelos forem importados.
*/

module.exports = Funcionario;
