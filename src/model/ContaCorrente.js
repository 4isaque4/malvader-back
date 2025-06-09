// tabelas/ContaCorrente.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Conta = require('./Conta');

class ContaCorrente extends Model {}

ContaCorrente.init({
    id_conta_corrente: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    limite: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    data_vencimento: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    taxa_manutencao: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0,
    },
    conta_id_conta: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Conta', // Padronizado para string
            key: 'id_conta',
        },
    },
}, {
    sequelize,
    modelName: 'ContaCorrente',
    tableName: 'conta_corrente',
    timestamps: false,
});

// Associação: Uma ContaCorrente pertence a uma Conta
ContaCorrente.belongsTo(Conta, { foreignKey: 'conta_id_conta', as: 'conta' });

// Associação Inversa: Uma Conta tem uma ContaCorrente (relação 1 para 1)
Conta.hasOne(ContaCorrente, { foreignKey: 'conta_id_conta', as: 'contaCorrente' });


module.exports = ContaCorrente;