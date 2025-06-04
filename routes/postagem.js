var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_email, insert_table_postagem, select_postagem_id } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('postagem_create', { title: 'Express' });
});

/* GET usuário por ID */
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); // garante que o banco e tabelas existam
    const postagem = await select_postagem_id(id); // espera os dados do usuário

    if (postagem) {
      res.render('postagem_select_id', {
        title: 'Express',
        posts: postagem,
        verificacao: true  // corrigido aqui
      });
    } else {
      res.render('postagem_select_id', {
        title: 'Express',
        users: null,
        verificacao: false  // corrigido aqui
      });
    }
  } catch (err) {
    console.error('Erro ao buscar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});


//veriificacao do email
router.post('/', async function (req, res, next) {
  const { vtitulo, vdescricao, vemail } = req.body;

  try {
    await ensureDatabaseExists();

    // Verifica se o usuário existe pelo email
    const usuario = await select_usuario_email(vemail);

    if (!usuario) {
      return res.render('postagem_create', {
        title: 'Postagem de Cadastro',
        verificacao: false,
        message: 'Usuário com este e-mail não encontrado.',
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
        message: 'Cadastrado com sucesso!',
      });
    } else {
      res.render('postagem_create', {
        title: 'Postagem de Cadastro',
        verificacao: false,
        message: 'Erro ao inserir postagem.',
      });
    }

  } catch (err) {
    console.error('Erro ao cadastrar postagem:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;