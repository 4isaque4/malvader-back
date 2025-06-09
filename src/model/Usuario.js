// src/model/Usuario.js

const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database'); // Certifique-se que o caminho está correto

class Usuario extends Model {}

Usuario.init({
  idUsuario: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  CPF: {
    type: DataTypes.STRING(11),
    allowNull: false,
    unique: true,
    validate: {
      isNumeric: true,
      len: [11, 11],
    },
  },
  // CAMPO ESSENCIAL ADICIONADO
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validação de formato de e-mail
    },
  },
  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  telefone: {
    type: DataTypes.STRING(15),
    allowNull: false,
  },
  tipo_usuario: {
    type: DataTypes.ENUM('FUNCIONARIO', 'CLIENTE'),
    allowNull: false,
  },
  senha_hash: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  otp_ativo: {
    type: DataTypes.STRING(6),
    allowNull: true, // Correto, pois só tem valor quando um OTP é solicitado
  },
  otp_expiracao: {
    type: DataTypes.DATE,
    allowNull: true, // Correto
  },
}, {
  sequelize,
  modelName: 'Usuario', // ✅ Melhor manter singular para consistência
  tableName: 'Usuario',
  timestamps: false,
});

module.exports = Usuario;