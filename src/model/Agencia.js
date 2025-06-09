// tabelas/Agencia.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Endereco = require('./Endereco');
const Conta = require('./Conta'); // Import ainda é útil para a associação

class Agencia extends Model {}

Agencia.init({
    id_agencia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    nome: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    codigo_agencia: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
    },
    endereco_id_endereco: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Endereco',
            key: 'id_endereco',
        },
    },
    // A coluna conta_id_conta foi REMOVIDA
}, {
    sequelize,
    modelName: 'Agencia',
    tableName: 'agencia',
    timestamps: false,
});

// Associações
Agencia.belongsTo(Endereco, { foreignKey: 'endereco_id_endereco', as: 'endereco' });
Endereco.hasMany(Agencia, { foreignKey: 'endereco_id_endereco', as: 'agencias' });

// Relação correta: Uma Agência tem muitas Contas
Agencia.hasMany(Conta, { foreignKey: 'agencia_id_agencia', as: 'contas' });

module.exports = Agencia;