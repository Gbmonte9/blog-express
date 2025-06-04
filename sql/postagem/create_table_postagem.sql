CREATE TABLE postagem (
    id varchar(100) PRIMARY KEY, -- UUID
    titulo varchar(200) NOT NULL,
    descricao text NOT NULL,
    dt_cadastro timestamp NOT NULL,
    ativo boolean NOT NULL,
    cod_usuario varchar(100) REFERENCES usuario(id)
);