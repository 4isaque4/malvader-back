// tabelas/ContaPoupanca.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Conta = require('./Conta');

class ContaPoupanca extends Model {}

ContaPoupanca.init({
    id_conta_poupanca: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    taxa_rendimento: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
    },
    ultimo_rendimento: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    conta_id_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Conta', // Padronizado
            key: 'id_conta',
        },
    },
}, {
    sequelize,
    modelName: 'ContaPoupanca',
    tableName: 'conta_poupanca',
    timestamps: false,
});

// Associação: Uma ContaPoupanca pertence a uma Conta
ContaPoupanca.belongsTo(Conta, { foreignKey: 'conta_id_conta', as: 'conta' });

// Associação Inversa: Uma Conta tem uma ContaPoupanca (relação 1 para 1)
Conta.hasOne(ContaPoupanca, { foreignKey: 'conta_id_conta', as: 'contaPoupanca' });

module.exports = ContaPoupanca;