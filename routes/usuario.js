var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_id, insert_table_usuario } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('usuario_create', { title: 'Express' });
});

/* GET usuário por ID */
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); // garante que o banco e tabelas existam
    const usuario = await select_usuario_id(id); // espera os dados do usuário

    if (usuario) {
      res.render('usuario_select_id', {
        title: 'Express',
        users: usuario,
        verificacao: true  // corrigido aqui
      });
    } else {
      res.render('usuario_select_id', {
        title: 'Express',
        users: null,
        verificacao: false  // corrigido aqui
      });
    }
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).send('Erro interno do servidor');
  }
});


//veriificacao do email
router.post('/', async function(req, res, next) {

  const { nome, email, senha, senha1 } = req.body;

  if (senha !== senha1) {
    return res.render('usuario_create', {
      title: 'Usuario Cadastro',
      verificacao: false,
      message: 'As senhas não coincidem.'
    });
  }

  const senhaHash = await hashPassword(senha);

  try {
    await ensureDatabaseExists();

    const novoUsuario = {
      vid: uuidv4(),       
      vnome: nome,
      vemail: email,
      vsenha: senhaHash,
      dt_cadastro: new Date(),
      vativo: true
    };

    const cadastro = await insert_table_usuario(novoUsuario);

    if (cadastro) {
      res.render('usuario_create', {
        title: 'Usuario Cadastro',
        verificacao: true,
        message: 'Cadastrado com Sucesso..'
      });
    } else {
      res.render('usuario_create', {
        title: 'Usuario Cadastro',
        verificacao: false,
        message: 'Erro ao inserir usuário.'
      });
    }
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;