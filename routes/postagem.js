var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, insert_table_postagem, select_postagem_id, select_usuario_id, select_comentario_postagem_id } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  const anoAtual = new Date().getFullYear(); 
  res.render('postagem_create', { title: 'Postagem', anoAtual });
});

/* GET usuário por ID */
router.get('/usuario/:id', async function(req, res, next) {
  const id = req.params.id;

  try {

    await ensureDatabaseExists(); 
    const usuario = await select_usuario_id(id);
    const anoAtual = new Date().getFullYear(); 

    if (usuario) {
      res.render('postagem_create', {
        title: 'Cadastra Postagem',
        users: usuario,
        anoAtual
      });
    } else {
      res.render('postagem_create', {
        title: 'Cadastra Postagem',
        users: null,
        anoAtual
      });
    }
  } catch (err) {
    console.error('Erro ao buscar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

router.post('/usuario/:id', async function(req, res, next) {
  const { vtitulo, vdescricao } = req.body;
  const usuario_id = req.params.id;

  try {
    await ensureDatabaseExists();

    const usuario = await select_usuario_id(usuario_id);
    const anoAtual = new Date().getFullYear(); 

    if (!usuario) {
      return res.render('postagem_create', {
        title: 'Cadastra Postagem',
        verificacao: false,
        users: usuario,
        message: 'Usuário id não encontrado.',
        anoAtual
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
        title: 'Cadastra Postagem',
        verificacao: true,
        users: usuario,
        message: 'Postagem Cadastrada com Sucesso.',
        anoAtual
      });
    } else {
      res.render('postagem_create', {
        title: 'Cadastra Postagem',
        verificacao: false,
        users: usuario,
        message: 'Erro ao inserir postagem.',
        anoAtual
      });
    }

  } catch (err) {
    console.error('Erro ao cadastrar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); 

    const postagem = await select_postagem_id(id); 
    const anoAtual = new Date().getFullYear(); 

    if (!postagem) {
      return res.render('postagem_select_id', {
        title: 'Postagem',
        posts: null,
        commits: null,
        verificacao: false,
        message: 'Postagem não encontrada.',
        anoAtual
      });
    }

    let comentario = await select_comentario_postagem_id(id);

    if (comentario && !Array.isArray(comentario)) {
      comentario = [comentario];
    }

    if (!comentario) {
      return res.render('postagem_select_id', {
        title: 'Postagem',
        posts: null,
        commits: null,
        verificacao: false,
        message: 'comentarios não encontrada.',
        anoAtual
      });
    }

    res.render('postagem_select_id', {
      title: 'Postagem Detalhada',
      posts: postagem,
      commits: comentario,
      verificacao: true,
      anoAtual
    });

  } catch (err) {
    console.error('Erro ao buscar postagem ou comentários:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

router.get('/:postId/usuario/:userId', async function(req, res, next) {
  const postId = req.params.postId;
  const userId = req.params.userId;

  try {
    await ensureDatabaseExists();

    const anoAtual = new Date().getFullYear();

    const postagem = await select_postagem_id(postId); 

    if (!postagem) {
      return res.render('postagem_select_id_e_usuarioid', {
        title: 'Postagem',
        posts: null,
        commits: null,
        verificacao: false,
        message: 'Postagem não encontrada.',
        anoAtual
      });
    }

    let comentario = await select_comentario_postagem_id(postagem.id);

    if (comentario && !Array.isArray(comentario)) {
      comentario = [comentario];
    }

    res.render('postagem_select_id_e_usuarioid', {
      title: 'Postagem Detalhada',
      posts: postagem,
      commits: comentario,
      verificacao: true,
      userId: userId,
      anoAtual
    });

  } catch (err) {
    console.error('Erro ao buscar postagem ou comentários:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;