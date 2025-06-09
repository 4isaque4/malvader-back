// tabelas/Conta.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Usuario = require('./Usuario');
const Agencia = require('./Agencia');

class Conta extends Model {}

Conta.init({
    id_conta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    numero_conta: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    saldo: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
        defaultValue: 0,
    },
    tipo_conta: {
        type: DataTypes.STRING(45),
        allowNull: false,
    },
    data_abertura: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    status: {
        type: DataTypes.STRING(45),
        allowNull: false,
        defaultValue: 'ATIVA',
    },
    // Chave estrangeira para o dono da conta
    Usuario_idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'idUsuario'
        }
    },
    // Chave estrangeira para a agência da conta
    agencia_id_agencia: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Agencia',
            key: 'id_agencia'
        }
    }
}, {
    sequelize,
    modelName: 'Conta',
    tableName: 'conta',
    timestamps: false,
});

// Definição das associações (relações)
Conta.belongsTo(Usuario, { foreignKey: 'Usuario_idUsuario', as: 'usuario' });
Conta.belongsTo(Agencia, { foreignKey: 'agencia_id_agencia', as: 'agencia' });

module.exports = Conta;