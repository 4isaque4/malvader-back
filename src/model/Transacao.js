// tabelas/Transacao.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Conta = require('./Conta');

class Transacao extends Model {}

Transacao.init({
    id_transacao: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    // --- CORREÇÃO APLICADA AQUI ---
    // Este campo agora é uma chave estrangeira oficial para a conta de origem.
    // Pode ser nulo (ex: em um depósito).
    id_conta_origem: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Conta',
            key: 'id_conta'
        }
    },
    // --- CORREÇÃO APLICADA AQUI ---
    // Este campo agora é uma chave estrangeira oficial para a conta de destino.
    // Pode ser nulo (ex: em um saque).
    id_conta_destino: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Conta',
            key: 'id_conta'
        }
    },
    tipo_transacao: {
        type: DataTypes.ENUM('Depósito', 'Saque', 'Transferência', 'Pagamento'),
        allowNull: false,
    },
    valor: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: false,
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    descricao: {
        type: DataTypes.STRING(100),
        allowNull: true,
    },
    // O campo 'conta_id_conta' foi REMOVIDO por ser redundante.
}, {
    sequelize,
    modelName: 'Transacao',
    tableName: 'transacao',
    timestamps: false, // Mantido como false, já que você tem 'data_hora'
});

// --- ASSOCIAÇÕES CORRIGIDAS ---
// Uma transação pertence a uma conta de origem (se houver)
Transacao.belongsTo(Conta, {
    foreignKey: 'id_conta_origem',
    as: 'contaOrigem' // Apelido para a relação
});

// Uma transação pertence a uma conta de destino (se houver)
Transacao.belongsTo(Conta, {
    foreignKey: 'id_conta_destino',
    as: 'contaDestino' // Apelido para a relação
});


// Definindo as relações inversas a partir da Conta
// Uma conta pode ter muitas transações onde ela é a origem
Conta.hasMany(Transacao, {
    foreignKey: 'id_conta_origem',
    as: 'transacoesEnviadas'
});

// Uma conta pode ter muitas transações onde ela é o destino
Conta.hasMany(Transacao, {
    foreignKey: 'id_conta_destino',
    as: 'transacoesRecebidas'
});


module.exports = Transacao;