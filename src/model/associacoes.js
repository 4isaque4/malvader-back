// src/model/associacoes.js

// -----------------------------------------------------
// 1. IMPORTAÇÃO DE TODOS OS MODELOS
// -----------------------------------------------------
const Usuario = require('./usuario');
const Cliente = require('./cliente');
const Funcionario = require('./funcionario');
const Endereco = require('./endereco');
const Agencia = require('./agencia');
const Conta = require('./conta');
const ContaPoupanca = require('./contaPoupanca');
const ContaCorrente = require('./contaCorrente');
const ContaInvestimento = require('./contaInvestimento');
const Transacao = require('./transacao');
const Auditoria = require('./auditoria');
const Relatorio = require('./relatorio'); 

// -----------------------------------------------------
// 2. DEFINIÇÃO DAS ASSOCIAÇÕES
// -----------------------------------------------------

// --- Relações do Usuário ---
Usuario.hasOne(Cliente, { foreignKey: 'id_usuario', as: 'perfilCliente' });
Cliente.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'dadosUsuario' });

Usuario.hasOne(Funcionario, { foreignKey: 'id_usuario', as: 'perfilFuncionario' });
Funcionario.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'dadosUsuario' });

// ASSOCIAÇÃO DE ENDEREÇO COM USUÁRIO:
// Um Usuário pode ter vários Endereços (1-para-N)
Usuario.hasMany(Endereco, { foreignKey: 'id_usuario', as: 'enderecos' });
// Um Endereço pertence a um Usuário
Endereco.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });

Usuario.hasMany(Auditoria, { foreignKey: 'id_usuario', as: 'registrosAuditoria' });
Auditoria.belongsTo(Usuario, { foreignKey: 'id_usuario', as: 'usuario' });


// --- Relações do Funcionário ---
Funcionario.hasMany(Funcionario, { foreignKey: 'id_supervisor', as: 'subordinados' });
Funcionario.belongsTo(Funcionario, { foreignKey: 'id_supervisor', as: 'supervisor' });

Funcionario.hasMany(Relatorio, { foreignKey: 'id_funcionario', as: 'relatoriosGerados' });
Relatorio.belongsTo(Funcionario, { foreignKey: 'id_funcionario', as: 'autor' });


// --- Relações da Conta e Agência ---
Cliente.hasMany(Conta, { foreignKey: 'id_cliente', as: 'contas' });
Conta.belongsTo(Cliente, { foreignKey: 'id_cliente', as: 'cliente' });

Agencia.hasMany(Conta, { foreignKey: 'id_agencia', as: 'contas' });
Conta.belongsTo(Agencia, { foreignKey: 'id_agencia', as: 'agencia' });

//  ASSOCIAÇÃO DE ENDEREÇO COM AGÊNCIA:
// Uma Agência tem um Endereço (1-para-1)
Agencia.belongsTo(Endereco, { foreignKey: 'id_endereco', as: 'endereco' });
// Opcional: Um Endereço pode ser de uma Agência
// Endereco.hasOne(Agencia, { foreignKey: 'id_endereco', as: 'agencia' });


// --- Relações de Tipos de Conta (1-para-1) ---
Conta.hasOne(ContaPoupanca, { foreignKey: 'id_conta', as: 'dadosPoupanca' });
ContaPoupanca.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });

Conta.hasOne(ContaCorrente, { foreignKey: 'id_conta', as: 'dadosCorrente' });
ContaCorrente.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });

Conta.hasOne(ContaInvestimento, { foreignKey: 'id_conta', as: 'dadosInvestimento' });
ContaInvestimento.belongsTo(Conta, { foreignKey: 'id_conta', as: 'contaGeral' });


// --- Relações da Transação ---
Conta.hasMany(Transacao, { foreignKey: 'id_conta_origem', as: 'transacoesEnviadas' });
Transacao.belongsTo(Conta, { foreignKey: 'id_conta_origem', as: 'contaOrigem' });

Conta.hasMany(Transacao, { foreignKey: 'id_conta_destino', as: 'transacoesRecebidas' });
Transacao.belongsTo(Conta, { foreignKey: 'id_conta_destino', as: 'contaDestino' });


// -----------------------------------------------------
// 3. EXPORTAÇÃO
// -----------------------------------------------------
module.exports = {
    Usuario,
    Cliente,
    Funcionario,
    Endereco,
    Agencia,
    Conta,
    ContaPoupanca,
    ContaCorrente,
    ContaInvestimento,
    Transacao,
    Auditoria,
    Relatorio
};
