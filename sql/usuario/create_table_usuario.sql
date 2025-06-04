CREATE TABLE usuario (
    id varchar(100) PRIMARY KEY, -- UUID
    nome varchar(50) DEFAULT NULL,
    email varchar(50) UNIQUE DEFAULT NULL,
    senha varchar(100) DEFAULT NULL,
    dt_cadastro timestamp NOT NULL,
    ativo boolean NOT NULL
);