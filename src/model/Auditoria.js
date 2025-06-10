// src/model/Auditoria.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Auditoria extends Model {}

Auditoria.init({
  // Mapeando as propriedades camelCase do JS para as colunas snake_case do banco.
  idAuditoria: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_auditoria'
  },
  idUsuario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_usuario'
  },
  acao: {
    type: DataTypes.STRING(50),
    allowNull: false,
    field: 'acao'
  },
  dataHora: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    field: 'data_hora'
  },
  detalhes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'detalhes'
  },
}, {
  sequelize,
  modelName: 'Auditoria',
  tableName: 'auditoria',
  timestamps: false,
  underscored: true
});

/*
  NOTA IMPORTANTE SOBRE ASSOCIAÇÕES:
  Para evitar erros de 'dependência circular', a melhor prática é definir
  TODAS as associações em um único arquivo central (como 'src/model/index.js')
  depois que todos os modelos forem importados.

  Exemplo de como ficaria nesse arquivo central:

  const Usuario = require('./Usuario');
  const Auditoria = require('./Auditoria');

  // Relação 1 para N: Uma Auditoria pertence a um Usuário.
  Auditoria.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });
  // Um usuário pode ter vários registros de auditoria.
  Usuario.hasMany(Auditoria, { foreignKey: 'id_usuario', as: 'registrosAuditoria' });

*/

module.exports = Auditoria;
