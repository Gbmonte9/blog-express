SELECT 
  postagem.*, 
  usuario.nome AS nome_usuario 
FROM postagem
JOIN usuario ON postagem.cod_usuario = usuario.id
WHERE postagem.id = $1;