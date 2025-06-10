// src/model/Cliente.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Cliente extends Model {}

Cliente.init({
  // Em JS, usamos camelCase para as propriedades e mapeamos para o banco com 'field'.
  idCliente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_cliente'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
    // A propriedade 'references' é melhor definida na associação centralizada.
  },
  scoreCredito: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: true,
    defaultValue: 0,
    field: 'score_credito'
  }
}, {
  sequelize,
  modelName: 'Cliente',
  tableName: 'cliente',
  timestamps: false,
  underscored: true // Garante que as chaves estrangeiras sigam o padrão snake_case.
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js'
  ou 'src/util/database.js') depois que todos os modelos forem importados.

  Exemplo de como ficaria nesse arquivo central:

  const Usuario = require('./Usuario');
  const Cliente = require('./Cliente');

  // Relação 1 para 1: Um Cliente é um tipo de Usuário.
  Usuario.hasOne(Cliente, { foreignKey: 'id_usuario', as: 'perfilCliente' });
  Cliente.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'dadosUsuario' });

*/

module.exports = Cliente;
