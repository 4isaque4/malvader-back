// src/model/ContaPoupanca.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class ContaPoupanca extends Model {}

ContaPoupanca.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idContaPoupanca: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_conta_poupanca'
  },
  idConta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Conforme o banco de dados, cada conta só pode ter um registro de poupança
    field: 'id_conta'
  },
  taxaRendimento: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'taxa_rendimento'
  },
  ultimoRendimento: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'ultimo_rendimento'
  },
}, {
  sequelize,
  modelName: 'ContaPoupanca',
  tableName: 'conta_poupanca',
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
  const ContaPoupanca = require('./ContaPoupanca');

  // Relação 1 para 1: Uma Conta tem um registro de ContaPoupanca.
  Conta.hasOne(ContaPoupanca, { foreignKey: 'id_conta', as: 'dadosPoupanca' });
  ContaPoupanca.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });

*/

module.exports = ContaPoupanca;
