SELECT c.id,
       c.descricao,
       c.dt_cadastro,
       c.ativo,
       c.cod_postagem,
       c.cod_usuario,
       u.nome AS usuario_nome
FROM comentario c
JOIN usuario u ON c.cod_usuario = u.id
WHERE c.cod_postagem = $1;