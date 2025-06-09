// tabelas/Auditoria.js

// Mudança 1: Importar 'Model' junto com 'DataTypes'
const { DataTypes, Model } = require('sequelize');
const sequelize = require('../util/database');
const Usuario = require('./Usuario');

// Mudança 2: Definir o modelo como uma classe que herda de Model
class Auditoria extends Model {}

// Mudança 3: Usar o método 'init' para definir colunas e opções
Auditoria.init({
    id_auditoria: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    acao: {
        type: DataTypes.STRING(50),
        allowNull: false,
    },
    data_hora: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    detalhes: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    Usuario_idUsuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            // Padronizado para usar o nome do modelo como string, igual ao Cliente.js
            model: 'Usuario',
            key: 'idUsuario',
        },
    },
}, {
    // Opções do modelo
    sequelize, // Passar a conexão sequelize
    modelName: 'Auditoria', // Definir o nome do modelo
    tableName: 'auditoria',
    timestamps: false,
});

// Definição das associações
Auditoria.belongsTo(Usuario, { foreignKey: 'Usuario_idUsuario', as: 'usuario' });

// Para manter a consistência, definimos a relação inversa aqui também
// Um usuário pode ter vários registros de auditoria (relação 1-para-N)
Usuario.hasMany(Auditoria, { foreignKey: 'Usuario_idUsuario', as: 'auditorias' });


module.exports = Auditoria;