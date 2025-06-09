// tabelas/ContaInvestimento.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Conta = require('./Conta');

class ContaInvestimento extends Model {}

ContaInvestimento.init({
    id_conta_investimento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    perfil_risco: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    valor_minimo: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    taxa_rendimento_base: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
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
    modelName: 'ContaInvestimento',
    tableName: 'conta_investimento',
    timestamps: true, // Configuração mantida
});

// Associação: Uma ContaInvestimento pertence a uma Conta
ContaInvestimento.belongsTo(Conta, { foreignKey: 'conta_id_conta', as: 'conta' });

// Associação Inversa: Uma Conta tem uma ContaInvestimento (relação 1 para 1)
Conta.hasOne(ContaInvestimento, { foreignKey: 'conta_id_conta', as: 'contaInvestimento' });

module.exports = ContaInvestimento;