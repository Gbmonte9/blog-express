var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_id, select_postagem_id, insert_table_comentario, select_comentario_id } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('comentario_create', { title: 'Express' });
});

/* GET usuário por ID */
router.get('/', async (req, res) => {
  try {
    await ensureDatabaseExists();
    const postagens = await select_todas_postagens(); // função que retorna [{id, titulo}]

    res.render('comentario_create', {
      title: 'Criar Comentário',
      postagens,
    });
  } catch (err) {
    console.error('Erro ao carregar formulário de comentário:', err);
    res.status(500).send('Erro interno no servidor');
  }
});

//veriificacao do email
// POST - Inserir comentário
router.post('/usuario/:usuarioId/postagem/:postagemId', async function(req, res) {
  const usuario_id = req.params.usuarioId;
  const postagem_id = req.params.postagemId;
  const { conteudo } = req.body;

  try {
    await ensureDatabaseExists();

    const usuario = await select_usuario_id(usuario_id);
    if (!usuario) {
      return res.render('postagem_select_id', {
        message: 'Usuário não encontrado!',
        verificacao: false,
        posts: null,
        commits: null
      });
    }

    const postagem = await select_postagem_id(postagem_id);
    if (!postagem) {
      return res.render('postagem_select_id', {
        message: 'Postagem não encontrada!',
        verificacao: false,
        posts: null,
        commits: null
      });
    }

    const novoComentario = {
      id: uuidv4(),
      texto: conteudo.trim(), // assumindo que sua tabela usa "texto" para o comentário
      dt_comentario: new Date(),
      ativo: true,
      cod_usuario: usuario.id,
      cod_postagem: postagem.id
    };

    await insert_table_comentario(novoComentario);

    const comentarios = await select_comentario_postagemId(postagem_id);

    res.render('postagem_select_id', {
      title: 'Postagem Detalhada',
      message: 'Comentário cadastrado com sucesso!',
      verificacao: true,
      posts: postagem,
      commits: comentarios,
      userId: usuario.id
    });

  } catch (err) {
    console.error('Erro ao inserir comentário:', err);
    res.status(500).send('Erro interno no servidor');
  }
});

module.exports = router;