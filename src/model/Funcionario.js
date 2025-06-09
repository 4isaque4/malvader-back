// tabelas/Funcionario.js
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Usuario = require('./Usuario');

class Funcionario extends Model {}

Funcionario.init({
    id_funcionario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    codigo_funcionario: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true // É uma boa prática que códigos sejam únicos
    },
    cargo: {
        type: DataTypes.ENUM('Supervisor', 'Funcionário simples'),
        allowNull: false,
    },
    // --- CORREÇÃO APLICADA AQUI ---
    // Este campo representa o supervisor do funcionário.
    // Ele referencia a própria tabela 'funcionario'.
    id_supervisor: {
        type: DataTypes.INTEGER,
        allowNull: true, // Permitido ser nulo (ex: o diretor não tem supervisor)
        references: {
            model: 'funcionario', // Referencia a si mesmo
            key: 'id_funcionario'
        }
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Usuario',
            key: 'idUsuario'
        }
    }
}, {
    sequelize,
    modelName: 'Funcionario',
    tableName: 'funcionario',
    timestamps: false
});

// Relação com Usuario (Herança dos dados básicos)
Funcionario.belongsTo(Usuario, {
    foreignKey: 'id_usuario',
    as: 'dadosUsuario' // Mudei para 'dadosUsuario' para ficar mais claro
});
Usuario.hasOne(Funcionario, {
    foreignKey: 'id_usuario',
    as: 'perfilFuncionario' // Mudei para 'perfilFuncionario'
});


// --- NOVA ASSOCIAÇÃO ADICIONADA AQUI ---
// Relação de Supervisão (Auto-relacionamento)

// Um Funcionário (subordinado) pertence a um Supervisor (que também é um Funcionário)
Funcionario.belongsTo(Funcionario, {
    foreignKey: 'id_supervisor',
    as: 'supervisor' // Apelido para quando buscarmos o supervisor de um funcionário
});

// Um Funcionário (supervisor) pode ter muitos outros Funcionários (subordinados)
Funcionario.hasMany(Funcionario, {
    foreignKey: 'id_supervisor',
    as: 'subordinados' // Apelido para quando buscarmos os subordinados de um supervisor
});

module.exports = Funcionario;