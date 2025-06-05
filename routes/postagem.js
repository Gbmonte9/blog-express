var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, insert_table_postagem, select_postagem_id, select_usuario_id, select_comentario_postagemId } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('postagem_create', { title: 'Express' });
});

/* GET usuário por ID */
router.get('/usuario/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); // garante que o banco e tabelas existam
    const usuario = await select_usuario_id(id);

    if (usuario) {
      res.render('postagem_create', {
        title: 'Cadastra Postagem',
        users: usuario,
        verificacao: true  // corrigido aqui
      });
    } else {
      res.render('postagem_create', {
        title: 'Cadastra Postagem',
        users: null,
        verificacao: false  // corrigido aqui
      });
    }
  } catch (err) {
    console.error('Erro ao buscar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

/* POST usuário por ID */
router.post('/usuario/:id', async function(req, res, next) {
  const { vtitulo, vdescricao } = req.body;
  const usuario_id = req.params.id;

  try {
    await ensureDatabaseExists();

    // Verifica se o usuário existe pelo email
    const usuario = await select_usuario_id(usuario_id);

    if (!usuario) {
      return res.render('postagem_create', {
        title: 'Postagem de Cadastro',
        verificacao: false,
        users: usuario,
        message: 'Usuário id não encontrado.',
      });
    }

    const novaPostagem = {
      id: uuidv4(),
      titulo: vtitulo.trim(),
      descricao: vdescricao.trim(),
      dt_cadastro: new Date(),
      ativo: true,
      usuario_id: usuario.id,
    };

    const cadastro = await insert_table_postagem(novaPostagem);

    if (cadastro) {
      res.render('postagem_create', {
        title: 'Postagem de Cadastro',
        verificacao: true,
        users: usuario,
        message: 'Cadastrado com sucesso!',
      });
    } else {
      res.render('postagem_create', {
        title: 'Postagem de Cadastro',
        verificacao: false,
        users: usuario,
        message: 'Erro ao inserir postagem.',
      });
    }

  } catch (err) {
    console.error('Erro ao cadastrar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// GET postagem por ID
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); // Garante que o banco e as tabelas existam

    const postagem = await select_postagem_id(id); // Busca a postagem pelo ID

    if (!postagem) {
      return res.render('postagem_select_id', {
        title: 'Postagem',
        posts: null,
        commits: null,
        verificacao: false,
        message: 'Postagem não encontrada.'
      });
    }

    const comentarios = await select_comentario_postagemId(postagem.id); // Busca os comentários da postagem

    res.render('postagem_select_id', {
      title: 'Postagem Detalhada',
      posts: postagem,
      commits: comentarios,
      verificacao: true
    });

  } catch (err) {
    console.error('Erro ao buscar postagem ou comentários:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

// GET postagem por ID e por ID de usuário
router.get('/postagem/:postId/usuario/:userId', async function(req, res, next) {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    
    await ensureDatabaseExists(); // Garante que o banco e as tabelas existam

    const postagens = await select_postagem_all();

    const postagem = await select_postagem_id(postId); // Busca a postagem pelo ID

    if (!postagem) {
      return res.render('postagem_select_id', {
        title: 'Postagem',
        posts: null,
        commits: null,
        verificacao: false,
        message: 'Postagem não encontrada.'
      });
    }

    const comentarios = await select_comentario_postagemId(postId); // Busca os comentários da postagem

    res.render('postagem_select_id', {
      title: 'Postagem Detalhada',
      posts: postagem,
      commits: comentarios,
      verificacao: true,
      userId: userId
    });

  } catch (err) {
    console.error('Erro ao buscar postagem ou comentários:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;