// src/model/Agencia.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Agencia extends Model {}

Agencia.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idAgencia: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_agencia'
  },
  nome: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'nome'
  },
  codigoAgencia: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true,
    field: 'codigo_agencia'
  },
  idEndereco: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_endereco'
  }
}, {
  sequelize,
  modelName: 'Agencia',
  tableName: 'agencia',
  timestamps: false,
  underscored: true
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js')
  depois que todos os modelos forem importados.

  Exemplo de como ficaria nesse arquivo central:

  const Agencia = require('./Agencia');
  const Endereco = require('./Endereco');
  const Conta = require('./Conta');

  // Relação 1 para 1: Uma Agência tem um Endereço.
  Agencia.belongsTo(Endereco, { foreignKey: 'id_endereco', as: 'endereco' });
  // Opcional: Um Endereço pode pertencer a uma Agência (se um endereço for exclusivo de uma agência).
  // Endereco.hasOne(Agencia, { foreignKey: 'id_endereco', as: 'agencia' });

  // Relação 1 para N: Uma Agência pode ter várias Contas.
  Agencia.hasMany(Conta, { foreignKey: 'id_agencia', as: 'contas' });
  Conta.belongsTo(Agencia, { foreignKey: 'id_agencia', as: 'agencia' });

*/

module.exports = Agencia;
