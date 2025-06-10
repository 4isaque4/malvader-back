// src/model/Usuario.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');

class Usuario extends Model {}

// O modelo é inicializado com a nova estrutura, mapeando os nomes
// do JavaScript (camelCase) para os nomes das colunas do banco (snake_case)
// usando a propriedade 'field'.
Usuario.init({
  id_usuario: { // Mantido como snake_case para consistência com o banco, mas camelCase (idUsuario) também é comum aqui.
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_usuario' // Mapeamento explícito para a coluna do banco
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome'
  },
  cpf: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    field: 'cpf',
    validate: {
      isNumeric: true,
      len: [11, 11],
    },
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'email',
    validate: {
      isEmail: true,
    },
  },
  dataNascimento: { // Em JavaScript, usamos camelCase
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_nascimento' // Mapeia para a coluna snake_case
  },
  telefone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    field: 'telefone'
  },
  tipoUsuario: { // camelCase
    type: DataTypes.ENUM('FUNCIONARIO', 'CLIENTE'),
    allowNull: false,
    field: 'tipo_usuario' // snake_case
  },
  senhaHash: { // camelCase
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'senha_hash' // snake_case
  },
  otpAtivo: { // camelCase
    type: DataTypes.STRING(6),
    allowNull: true,
    field: 'otp_ativo' // snake_case
  },
  otpExpiracao: { // camelCase
    type: DataTypes.DATE,
    allowNull: true,
    field: 'otp_expiracao' // snake_case
  },
}, {
  sequelize,
  modelName: 'Usuario',      // Nome do modelo em JavaScript
  tableName: 'usuario',      // Nome exato da tabela no banco de dados
  timestamps: false,         // Não criar colunas createdAt e updatedAt
  underscored: true,         // Ajuda o Sequelize a entender que você usa snake_case no banco
});

module.exports = Usuario;
