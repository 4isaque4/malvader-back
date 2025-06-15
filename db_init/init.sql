-- db_init/init.sql
-- MySQL Workbench Forward Engineering
SET @OLD_UNIQUE_CHECKS      = @@UNIQUE_CHECKS, UNIQUE_CHECKS      = 0;
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;
SET @OLD_SQL_MODE            = @@SQL_MODE, SQL_MODE= 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema banco_malvader
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `banco_malvader`
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `banco_malvader`;

-- -----------------------------------------------------
-- Table `Usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `Usuario` (
  `idUsuario`          INT           NOT NULL AUTO_INCREMENT,
  `nome`               VARCHAR(100)  NOT NULL,
  `CPF`                VARCHAR(11)   NOT NULL,
  `data_nascimento`    DATE          NOT NULL,
  `telefone`           VARCHAR(15)   NOT NULL,
  `tipo_usuario`       VARCHAR(45)   NOT NULL,
  `senha_hash`         VARCHAR(255)  NOT NULL,
  `otp_ativo`          VARCHAR(6)    NULL,
  `otp_expiracao`      DATETIME      NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `CPF_UNIQUE` (`CPF`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `funcionario` (
  `id_funcionario`     INT          NOT NULL AUTO_INCREMENT,
  `codigo_funcionario` VARCHAR(20)  NOT NULL,
  `cargo`              VARCHAR(45)  NOT NULL,
  `id_supervisor`      INT          NULL,
  `id_usuario`         INT          NOT NULL,
  PRIMARY KEY (`id_funcionario`),
  UNIQUE KEY `codigo_funcionario_UNIQUE` (`codigo_funcionario`),
  KEY `fk_funcionario_usuario_idx` (`id_usuario`),
  KEY `fk_funcionario_supervisor_idx` (`id_supervisor`),
  CONSTRAINT `fk_funcionario_usuario`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_funcionario_supervisor`
    FOREIGN KEY (`id_supervisor`)
    REFERENCES `funcionario` (`id_funcionario`)
    ON DELETE SET NULL
    ON UPDATE CASCADE
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cliente` (
  `id_cliente`         INT          NOT NULL AUTO_INCREMENT,
  `score_credito`      DECIMAL(5,2) NULL DEFAULT 0,
  `Usuario_idUsuario`  INT          NOT NULL,
  PRIMARY KEY (`id_cliente`),
  KEY `fk_cliente_Usuario_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_cliente_Usuario`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `endereco`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `endereco` (
  `id_endereco`        INT          NOT NULL AUTO_INCREMENT,
  `cep`                VARCHAR(10)  NOT NULL,
  `local`              VARCHAR(100) NOT NULL,
  `numero_casa`        INT          NOT NULL,
  `bairro`             VARCHAR(50)  NOT NULL,
  `cidade`             VARCHAR(50)  NOT NULL,
  `estado`             CHAR(2)      NOT NULL,
  `complemento`        VARCHAR(50)  NULL,
  `Usuario_idUsuario`  INT          NOT NULL,
  PRIMARY KEY (`id_endereco`),
  KEY `fk_endereco_Usuario_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_endereco_Usuario`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `conta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `conta` (
  `id_conta`           INT           NOT NULL AUTO_INCREMENT,
  `numero_conta`       VARCHAR(20)   NOT NULL,
  `saldo`              DECIMAL(15,2) NOT NULL DEFAULT 0,
  `tipo_conta`         VARCHAR(45)   NOT NULL,
  `data_abertura`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `status`             VARCHAR(45)   NOT NULL DEFAULT 'ATIVA',
  `Usuario_idUsuario`  INT           NOT NULL,
  PRIMARY KEY (`id_conta`),
  UNIQUE KEY `numero_conta_UNIQUE` (`numero_conta`),
  KEY `fk_conta_Usuario_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_conta_Usuario`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `agencia`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `agencia` (
  `id_agencia`           INT          NOT NULL AUTO_INCREMENT,
  `nome`                 VARCHAR(50)  NOT NULL,
  `codigo_agencia`       VARCHAR(10)  NOT NULL,
  `endereco_id_endereco` INT          NOT NULL,
  `conta_id_conta`       INT          NOT NULL,
  PRIMARY KEY (`id_agencia`),
  UNIQUE KEY `codigo_agencia_UNIQUE` (`codigo_agencia`),
  KEY `fk_agencia_endereco_idx` (`endereco_id_endereco`),
  KEY `fk_agencia_conta_idx`    (`conta_id_conta`),
  CONSTRAINT `fk_agencia_endereco`
    FOREIGN KEY (`endereco_id_endereco`)
    REFERENCES `endereco` (`id_endereco`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_agencia_conta`
    FOREIGN KEY (`conta_id_conta`)
    REFERENCES `conta` (`id_conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `conta_poupanca`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `conta_poupanca` (
  `id_conta_poupanca`    INT           NOT NULL AUTO_INCREMENT,
  `taxa_rendimento`      DECIMAL(5,2)  NOT NULL,
  `ultimo_rendimento`    DATETIME      NULL,
  `conta_id_conta`       INT           NOT NULL,
  PRIMARY KEY (`id_conta_poupanca`),
  KEY `fk_conta_poupanca_conta_idx` (`conta_id_conta`),
  CONSTRAINT `fk_conta_poupanca_conta`
    FOREIGN KEY (`conta_id_conta`)
    REFERENCES `conta` (`id_conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `conta_corrente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `conta_corrente` (
  `id_conta_corrente`    INT           NOT NULL AUTO_INCREMENT,
  `limite`               DECIMAL(15,2) NOT NULL DEFAULT 0,
  `data_vencimento`      DATE          NOT NULL,
  `taxa_manutencao`      DECIMAL(5,2)  NOT NULL DEFAULT 0,
  `conta_id_conta`       INT           NOT NULL,
  PRIMARY KEY (`id_conta_corrente`),
  KEY `fk_conta_corrente_conta_idx` (`conta_id_conta`),
  CONSTRAINT `fk_conta_corrente_conta`
    FOREIGN KEY (`conta_id_conta`)
    REFERENCES `conta` (`id_conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `conta_investimento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `conta_investimento` (
  `id_conta_investimento` INT           NOT NULL AUTO_INCREMENT,
  `perfil_risco`          VARCHAR(45)   NOT NULL,
  `valor_minimo`          DECIMAL(15,2) NOT NULL,
  `taxa_rendimento_base`  DECIMAL(5,2)  NOT NULL,
  `conta_id_conta`        INT           NOT NULL,
  PRIMARY KEY (`id_conta_investimento`),
  KEY `fk_conta_investimento_conta_idx` (`conta_id_conta`),
  CONSTRAINT `fk_conta_investimento_conta`
    FOREIGN KEY (`conta_id_conta`)
    REFERENCES `conta` (`id_conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `transacao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `transacao` (
  `id_transacao`          INT           NOT NULL AUTO_INCREMENT,
  `id_conta_origem`       INT           NULL,
  `id_conta_destino`      INT           NULL,
  `tipo_transacao`        VARCHAR(45)   NOT NULL,
  `valor`                 DECIMAL(15,2) NOT NULL,
  `data_hora`             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `descricao`             VARCHAR(100)  NULL,
  `conta_id_conta`        INT           NOT NULL,
  PRIMARY KEY (`id_transacao`),
  KEY `fk_transacao_conta_idx` (`conta_id_conta`),
  CONSTRAINT `fk_transacao_conta`
    FOREIGN KEY (`conta_id_conta`)
    REFERENCES `conta` (`id_conta`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `auditoria`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id_auditoria`          INT           NOT NULL AUTO_INCREMENT,
  `acao`                  VARCHAR(50)   NOT NULL,
  `data_hora`             TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `detalhes`              TEXT          NULL,
  `Usuario_idUsuario`     INT           NOT NULL,
  PRIMARY KEY (`id_auditoria`),
  KEY `fk_auditoria_Usuario_idx` (`Usuario_idUsuario`),
  CONSTRAINT `fk_auditoria_Usuario`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `relatorio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `relatorio` (
  `id_relatorio`          INT           NOT NULL AUTO_INCREMENT,
  `tipo_relatorio`        VARCHAR(50)   NOT NULL,
  `data_geracao`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `conteudo`              TEXT          NOT NULL,
  `funcionario_id`        INT           NOT NULL,
  PRIMARY KEY (`id_relatorio`),
  KEY `fk_relatorio_funcionario_idx` (`funcionario_id`),
  CONSTRAINT `fk_relatorio_funcionario`
    FOREIGN KEY (`funcionario_id`)
    REFERENCES `funcionario` (`id_funcionario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `permissao`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissao` (
  `id_role`               INT           NOT NULL AUTO_INCREMENT,
  `nome`                  VARCHAR(45)   NOT NULL,
  `descricao`             VARCHAR(100)  NULL,
  PRIMARY KEY (`id_role`),
  UNIQUE KEY `nome_UNIQUE` (`nome`)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table `permissao_usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `permissao_usuario` (
  `id_permissao_usuario`  INT           NOT NULL AUTO_INCREMENT,
  `Usuario_idUsuario`     INT           NOT NULL,
  `permissao_id_role`     INT           NOT NULL,
  PRIMARY KEY (`id_permissao_usuario`),
  KEY `fk_permissao_usuario_Usuario_idx`   (`Usuario_idUsuario`),
  KEY `fk_permissao_usuario_permissao_idx` (`permissao_id_role`),
  CONSTRAINT `fk_permissao_usuario_Usuario`
    FOREIGN KEY (`Usuario_idUsuario`)
    REFERENCES `Usuario` (`idUsuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_permissao_usuario_permissao`
    FOREIGN KEY (`permissao_id_role`)
    REFERENCES `permissao` (`id_role`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

-- Restaura configurações originais
SET SQL_MODE          = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS    = @OLD_UNIQUE_CHECKS;

-- ----------------------------------------------------------------------------------------------------------------
-- 1.    Atualização de Saldo: Após cada transação (INSERT em transacao), atualizar o saldo da conta correspondente.
-- ----------------------------------------------------------------------------------------------------------------

DELIMITER $$
CREATE TRIGGER atualizar_saldo AFTER INSERT ON transacao
FOR EACH ROW
BEGIN
    IF NEW.tipo_transacao = 'DEPOSITO' THEN
        UPDATE conta SET saldo = saldo + NEW.valor WHERE id_conta = NEW.conta_id_conta; -- A FK está como conta_id_conta em transacao
    ELSEIF NEW.tipo_transacao IN ('SAQUE', 'TAXA') THEN
        UPDATE conta SET saldo = saldo - NEW.valor WHERE id_conta = NEW.conta_id_conta;
    ELSEIF NEW.tipo_transacao = 'TRANSFERENCIA' THEN
        UPDATE conta SET saldo = saldo - NEW.valor WHERE id_conta = NEW.id_conta_origem;
        UPDATE conta SET saldo = saldo + NEW.valor WHERE id_conta = NEW.id_conta_destino;
    END IF;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------
-- 2.    Validação de Senha Forte: Antes de atualizar senha_hash em usuario,
--     verificar se a senha tem pelo menos 8 caracteres, 1 letra maiúscula, 1 número e 1 caractere especial.
-- ----------------------------------------------------------------------------------------------------------------

DELIMITER $$
CREATE TRIGGER validar_senha BEFORE UPDATE ON Usuario -- A tabela é 'Usuario' com 'U' maiúsculo
FOR EACH ROW
BEGIN
    -- O hash MD5 tem 32 caracteres hexadecimais. Esta REGEXP verifica o formato MD5.
    -- Se você for usar bcrypt, o hash será maior e o REGEXP precisa mudar.
    -- Para validação de senha forte, a lógica normalmente seria no aplicativo (backend) antes de gerar o hash.
    -- Este trigger pode ser ajustado para verificar a força da NOVA senha_hash
    -- assumindo que o backend envia uma senha hashada que pode ser validada (ex: comprimento para bcrypt).
    -- Para MD5 simples, este trigger parece estar sinalizando se a senha não é um MD5 válido.
    -- Se a validação de força for baseada na senha em texto claro, ela deveria ocorrer no aplicativo antes do hash.
    -- Dada a instrução "senha criptografada (MD5 ou superior)", o backend já deve hash.
    -- Este trigger aqui pode ser mais sobre garantir que a senha hash não seja vazia ou em formato incorreto.
    -- Para a validação de força (maiuscula, num, especial), o ideal é que seja no backend antes do hash.
    -- Se NEW.senha_hash não corresponde a um padrão de hash válido ou é vazia
    IF NEW.senha_hash IS NULL OR LENGTH(NEW.senha_hash) < 8 THEN -- Exemplo de uma validação simples para hash
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Senha hash inválida ou muito curta. Use um hash forte.';
    END IF;

    -- Exemplo de como seria se você quisesse validar a senha forte AQUI (não recomendado para hashes)
    -- IF NEW.senha_texto_claro NOT REGEXP '[A-Z]' OR
    --    NEW.senha_texto_claro NOT REGEXP '[0-9]' OR
    --    NEW.senha_texto_claro NOT REGEXP '[!@#$%^&*()_+={}\[\]:;<>,.?~\\/-]' OR
    --    LENGTH(NEW.senha_texto_claro) < 8 THEN
    --    SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Senha deve ter no mínimo 8 caracteres, 1 maiúscula, 1 número e 1 caractere especial.';
    -- END IF;
END $$
DELIMITER ;

-- Nota: A validação de senha forte (1 maiúscula, 1 número, 1 caractere especial) é mais segura e flexível quando feita no backend (Node.js) antes de o hash ser gerado e enviado para o banco de dados. O trigger no banco pode focar em validações mais básicas do hash ou integridade.

-- ----------------------------------------------------------------------------------------------------------------
-- 3.    Limite de Depósito Diário: Bloquear depósitos acima de R$10.000 por dia por cliente.
-- ----------------------------------------------------------------------------------------------------------------

DELIMITER $$
CREATE TRIGGER limite_deposito BEFORE INSERT ON transacao
FOR EACH ROW
BEGIN
    DECLARE total_dia DECIMAL(15,2);
    SELECT SUM(valor) INTO total_dia
    FROM transacao
    WHERE conta_id_conta = NEW.conta_id_conta -- Ajuste para usar conta_id_conta
      AND tipo_transacao = 'DEPOSITO'
      AND DATE(data_hora) = DATE(NEW.data_hora);
    IF (total_dia + NEW.valor) > 10000 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Limite diário de depósito excedido';
    END IF;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------
-- Procedimentos Armazenados (Stored Procedures)
-- 1.    Gerar OTP: Cria um código temporário de 6 dígitos válido por 5 minutos.
-- ----------------------------------------------------------------------------------------------------------------

DELIMITER $$
CREATE PROCEDURE gerar_otp(IN id_usuario INT)
BEGIN
    DECLARE novo_otp VARCHAR(6);
    SET novo_otp = LPAD(FLOOR(RAND() * 1000000), 6, '0');
    UPDATE Usuario SET otp_ativo = novo_otp, otp_expiracao = NOW() + INTERVAL 5 MINUTE -- Tabela 'Usuario'
    WHERE idUsuario = id_usuario; -- Coluna 'idUsuario'
    SELECT novo_otp;
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------
-- 2.    Calcular Score de Crédito: Atualiza o score do cliente com base no histórico de transações.
-- ----------------------------------------------------------------------------------------------------------------

DELIMITER $$
CREATE PROCEDURE calcular_score_credito(IN p_id_cliente INT) -- Usar prefixo para parâmetro para evitar ambiguidade
BEGIN
    DECLARE total_trans DECIMAL(15,2);
    DECLARE media_trans DECIMAL(15,2);
    SELECT SUM(t.valor), AVG(t.valor) INTO total_trans, media_trans
    FROM transacao t
    JOIN conta c ON t.conta_id_conta = c.id_conta -- Ajuste para conta_id_conta
    JOIN cliente cl ON c.Usuario_idUsuario = cl.Usuario_idUsuario -- Ajuste para FK correta
    WHERE cl.id_cliente = p_id_cliente AND t.tipo_transacao IN ('DEPOSITO', 'SAQUE');

    -- Garante que total_trans e media_trans não são NULL para evitar erros
    SET total_trans = IFNULL(total_trans, 0);
    SET media_trans = IFNULL(media_trans, 0);

    UPDATE cliente SET score_credito = LEAST(100, (total_trans / 1000) + (media_trans / 100))
    WHERE id_cliente = p_id_cliente; -- Usa o parâmetro para WHERE
END $$
DELIMITER ;

-- ----------------------------------------------------------------------------------------------------------------
-- Visões (Views)
-- 1.    Resumo de Contas por Cliente:
-- ----------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_resumo_contas AS
SELECT
  c.id_cliente,
  u.nome,
  COUNT(co.id_conta) AS total_contas,
  SUM(co.saldo) AS saldo_total
FROM cliente c
JOIN Usuario u ON c.Usuario_idUsuario = u.idUsuario -- Tabela 'Usuario' e FK 'Usuario_idUsuario'
JOIN conta co ON co.Usuario_idUsuario = u.idUsuario -- FK na tabela 'conta'
GROUP BY c.id_cliente, u.nome;

-- ----------------------------------------------------------------------------------------------------------------
-- 2.    Movimentações Recentes:
-- ----------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE VIEW vw_movimentacoes_recentes AS
SELECT
  t.*,
  c.numero_conta,
  u.nome AS cliente_nome -- Renomeado para evitar conflito com a tabela 'cliente'
FROM transacao t
JOIN conta c ON t.conta_id_conta = c.id_conta -- Ajuste para conta_id_conta
JOIN cliente cl ON c.Usuario_idUsuario = cl.Usuario_idUsuario -- Ajuste para FK correta
JOIN Usuario u ON cl.Usuario_idUsuario = u.idUsuario -- Tabela 'Usuario'
WHERE t.data_hora >= NOW() - INTERVAL 90 DAY;

use banco_malvader;