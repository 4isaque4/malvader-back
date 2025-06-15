// src/model/ContaCorrente.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class ContaCorrente extends Model {}

ContaCorrente.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idContaCorrente: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_conta_corrente'
  },
  idConta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Cada conta só pode ter um registro de conta corrente
    field: 'id_conta'
  },
  limite: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'limite'
  },
  dataVencimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_vencimento'
  },
  taxaManutencao: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    defaultValue: 0,
    field: 'taxa_manutencao'
  },
}, {
  sequelize,
  modelName: 'ContaCorrente',
  tableName: 'conta_corrente',
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
  const ContaCorrente = require('./ContaCorrente');

  // Relação 1 para 1: Uma Conta tem um registro de ContaCorrente.
  Conta.hasOne(ContaCorrente, { foreignKey: 'id_conta', as: 'dadosCorrente' });
  ContaCorrente.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });

*/

module.exports = ContaCorrente;
