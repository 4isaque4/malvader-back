🏦 Banco Malvader - API de Sistema Bancário
Este repositório contém o backend para a aplicação "Banco Malvader", um projeto de sistema bancário desenvolvido como parte do trabalho de Programação Laboratorial de Banco de Dados. A API foi construída em Node.js com Express e utiliza o Sequelize como ORM para interagir com um banco de dados MySQL.

🎯 Objetivo do Projeto
O objetivo é simular as operações de uma instituição financeira, implementando funcionalidades avançadas como autenticação multifator (senha e OTP), gerenciamento de contas, hierarquia de funcionários com permissões, operações financeiras e geração de relatórios, com foco em uma arquitetura de software robusta e um design de banco de dados relacional complexo.

✨ Tecnologias Utilizadas
Backend: Node.js, Express.js

Banco de Dados: MySQL

ORM: Sequelize

Autenticação: JSON Web Tokens (JWT), Bcrypt (para hash de senhas)

Validação: Middlewares personalizados de autenticação e permissão

Geração de Relatórios: exceljs, pdfkit

Envio de E-mail: nodemailer (para envio de OTP)

Variáveis de Ambiente: dotenv

📂 Estrutura do Projeto
O projeto segue uma arquitetura baseada em camadas, similar ao padrão MVC, para garantir a separação de responsabilidades e a manutenibilidade do código.

/src/model: Contém as definições dos modelos do Sequelize, que representam as tabelas do banco de dados.

/src/dao: (Data Access Object) Camada responsável por toda a comunicação direta com o banco de dados (queries SELECT, INSERT, UPDATE, DELETE).

/src/controller: Camada que contém a lógica de negócio da aplicação. Ela orquestra as operações, recebe as requisições das rotas e chama os DAOs.

/src/helpers: Contém funções utilitárias e middlewares, como autenticação, permissões e envio de e-mails.

/view/routes: Define todos os endpoints da API, mapeando cada rota para um método do controller correspondente.

/src/util: Contém a configuração da conexão com o banco de dados.

🛠️ Configuração do Ambiente
Siga os passos abaixo para configurar e executar o projeto localmente.

Pré-requisitos
Node.js (versão 18.x ou superior)

Servidor MySQL

1. Instalação
Clone o repositório e instale as dependências:

git clone [https://github.com/4isaque4/malvader-back.git](https://github.com/4isaque4/malvader-back.git)
cd malvader-back
npm install

2. Configuração do Banco de Dados
Certifique-se de que seu servidor MySQL está rodando.

Crie um banco de dados chamado banco_malvader.

Execute o script SQL completo (banco_malvader_limpo.sql ou similar) para criar todas as tabelas, views, triggers e procedures necessários.

3. Variáveis de Ambiente
Na raiz do projeto, crie um arquivo chamado .env.

Copie o conteúdo do arquivo .env.example (se houver) ou use a estrutura abaixo e preencha com suas credenciais:

# Variáveis do servidor
PORT=3000

# Banco de dados MySQL
DB_HOST=localhost
DB_PORT=3306
DB_USER=seu_usuario_mysql
DB_PASSWORD=sua_senha_mysql
DB_NAME=banco_malvader

# JWT (para autenticação)
JWT_SECRET=sua_chave_secreta_super_dificil
JWT_EXPIRATION=1d

# Configuração de E-mail para GMAIL (para envio de OTP)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="seu_email@gmail.com"
EMAIL_PASS="sua_senha_de_app_de_16_caracteres"

Importante: O EMAIL_PASS deve ser uma Senha de App gerada na sua conta Google, e não a sua senha de login principal.

4. Executando a Aplicação
Para iniciar o servidor, execute:

node server.js

Ou, se tiver o nodemon instalado para desenvolvimento:

nodemon server.js

O servidor estará rodando em http://localhost:3000.

📖 Documentação da API
Autenticação e Usuários (/api/usuarios)
POST /login
Descrição: Autentica um usuário e retorna um token JWT.

Autorização: Pública.

Corpo (JSON):

{
  "email": "ana.atendente@malvader.com",
  "senha": "SenhaAtendente123!"
}

Resposta de Sucesso (200 OK): { "mensagem": "Login bem-sucedido!", "token": "..." }

Funcionários (/api/funcionarios)
POST /criar
Descrição: Cria um novo funcionário (usuário + perfil de funcionário).

Autorização: Gerente (Bearer Token).

Corpo (JSON):

{
  "usuario": { "nome": "...", "cpf": "...", ... },
  "funcionario": { "codigo_funcionario": "...", "cargo": "ATENDENTE" }
}

Clientes (/api/clientes)
POST /criar
Descrição: Cria um novo cliente (usuário + perfil de cliente).

Autorização: Atendente ou Gerente (Bearer Token).

Corpo (JSON):

{
  "usuario": { "nome": "...", "cpf": "...", ... },
  "cliente": {}
}

Agências (/api/agencias)
POST /criar
Descrição: Cria uma nova agência e seu endereço.

Autorização: Gerente (Bearer Token).

Corpo (JSON):

{
  "agencia": { "nome": "Agência Central", "codigoAgencia": "001" },
  "endereco": { "cep": "...", "local": "...", ... }
}

Contas (/api/contas)
POST /criar
Descrição: Abre uma nova conta para um cliente existente.

Autorização: Atendente ou Gerente (Bearer Token).

Corpo (JSON):

{
  "cpfCliente": "11122233344",
  "idAgencia": 1,
  "tipoConta": "CORRENTE",
  "dadosEspecificos": {
    "limite": 1000.00,
    "dataVencimento": "2026-12-31",
    "taxaManutencao": 15.50
  }
}

POST /deposito
Descrição: Realiza um depósito em uma conta.

Autorização: Qualquer usuário logado (Bearer Token).

Corpo (JSON):

{
  "numeroConta": "1749843576205-133",
  "valor": 500.00
}

POST /transferencia
Descrição: Transfere um valor entre duas contas.

Autorização: Qualquer usuário logado (Bearer Token).

Corpo (JSON):

{
  "numeroContaOrigem": "1749843576205-133",
  "numeroContaDestino": "1749845584278-655",
  "valor": 150.00
}

Relatórios (/api/relatorios)
GET /movimentacoes
Descrição: Gera os arquivos relatorio_movimentacoes.xlsx e .pdf na raiz do projeto.

Autorização: Qualquer funcionário logado (Bearer Token).

Corpo: Nenhum.

Resposta de Sucesso (200 OK): { "mensagem": "Relatório de movimentações gerado com sucesso!" }