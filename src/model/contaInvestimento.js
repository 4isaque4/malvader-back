// src/model/ContaInvestimento.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class ContaInvestimento extends Model {}

ContaInvestimento.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idContaInvestimento: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_conta_investimento'
  },
  idConta: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true, // Cada conta só pode ter um registro de investimento
    field: 'id_conta'
  },
  perfilRisco: {
    type: DataTypes.ENUM('BAIXO', 'MEDIO', 'ALTO'), // Atualizado para ENUM conforme o novo BD
    allowNull: false,
    field: 'perfil_risco'
  },
  valorMinimo: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
    field: 'valor_minimo'
  },
  taxaRendimentoBase: {
    type: DataTypes.DECIMAL(5, 2),
    allowNull: false,
    field: 'taxa_rendimento_base'
  },
}, {
  sequelize,
  modelName: 'ContaInvestimento',
  tableName: 'conta_investimento',
  timestamps: false, // Corrigido para false, pois a tabela não possui colunas de timestamp
  underscored: true
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js')
  depois que todos os modelos forem importados.

  Exemplo de como ficaria nesse arquivo central:

  const Conta = require('./Conta');
  const ContaInvestimento = require('./ContaInvestimento');

  // Relação 1 para 1: Uma Conta tem um registro de ContaInvestimento.
  Conta.hasOne(ContaInvestimento, { foreignKey: 'id_conta', as: 'dadosInvestimento' });
  ContaInvestimento.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });

*/

module.exports = ContaInvestimento;
