var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_id, select_postagem_id, insert_table_comentario, select_comentario_id, select_comentario_postagem_id } = require('../db'); // Ajustar caminho se necessário
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

// POST - Inserir comentário
router.post('/postagem/:postagemId/usuario/:usuarioId', async function(req, res) {
  const postagem_id = req.params.postagemId;
  const usuario_id = req.params.usuarioId;
  const { conteudo } = req.body;

  try {
    await ensureDatabaseExists();

    const usuario = await select_usuario_id(usuario_id);

    if (!usuario) {
      return res.render('postagem_select_id_e_usuarioid', {
        message: 'Postagem',
        verificacao: false,
        postagem: null,
        commits: null
      });
    }

    const postagem = await select_postagem_id(postagem_id);
    if (!postagem) {
      return res.render('postagem_select_id_e_usuarioid', {
        message: 'Postagem',
        verificacao: false,
        postagem: null,
        commits: null
      });
    }

    const novoComentario = {
      id: uuidv4(),
      descricao: conteudo.trim(),      
      dt_cadastro: new Date(),         
      ativo: true,
      cod_postagem: postagem.id,
      cod_usuario: usuario.id
    };

    await insert_table_comentario(novoComentario);

    let comentario = await select_comentario_postagem_id(postagem.id);

    if (comentario && !Array.isArray(comentario)) {
      comentario = [comentario];
    }

    res.render('postagem_select_id_e_usuarioid', {
      title: 'Postagem',
      message: 'Comentário cadastrado com sucesso!',
      verificacao: true,
      posts: postagem,
      commits: comentario,
      userId: usuario.id
    });

  } catch (err) {
    console.error('Erro ao inserir comentário:', err);
    res.status(500).send('Erro interno no servidor');
  }
});

module.exports = router;