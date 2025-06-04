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
router.post('/', async function(req, res) {
  const { email, postagem_id, conteudo } = req.body;

  try {
    await ensureDatabaseExists();

    // Busca o ID do usuário pelo email
    const usuario = await select_usuario_email(email);

    if (!usuario) {
      return res.render('comentario_create', {
        message: 'Usuário não encontrado!',
        verificacao: false,
        postagens: await select_todas_postagens()
      });
    }

    const novoComentario = {
      id: uuidv4(),
      conteudo: conteudo.trim(),
      dt_cadastro: new Date(),
      ativo: true,
      usuario_id: usuario.id,
      postagem_id: postagem_id,
    };

    const resultado = await insert_table_comentario(novoComentario);

    res.render('comentario_create', {
      message: 'Comentário cadastrado com sucesso!',
      verificacao: true,
      postagens: await select_todas_postagens()
    });

  } catch (err) {
    console.error('Erro ao inserir comentário:', err);
    res.status(500).send('Erro interno');
  }
});

module.exports = router;