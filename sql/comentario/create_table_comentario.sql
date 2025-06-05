CREATE TABLE comentario (
    id varchar(100) PRIMARY KEY, -- UUID
    descricao text NOT NULL,
    dt_cadastro timestamp NOT NULL,
    ativo boolean NOT NULL,
    cod_postagem varchar(100) REFERENCES postagem(id),
    cod_usuario varchar(100) REFERENCES usuario(id)
);