var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_id, insert_table_usuario, select_postagem_ativo, select_usuario_email_e_ativo} = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  const anoAtual = new Date().getFullYear(); 
  res.render('usuario_create', { title: 'Cadastro Usuario', anoAtual });
});

router.get('/login', function(req, res, next) {
  const anoAtual = new Date().getFullYear();
  res.render('usuario_login', { title: 'Login de Usuario', anoAtual });
});

router.post('/login', async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    await ensureDatabaseExists(); 
    const usuario = await select_usuario_email_e_ativo(email); 
    const anoAtual = new Date().getFullYear(); 

    if (!usuario) {
      return res.render('usuario_login', {
        title: 'Login de Usuario',
        message: 'Email incorreto ou desativo',
        anoAtual
      });
    }

    const senhaCorreta = await comparePassword(senha, usuario.senha);

    if (senhaCorreta) {

      return res.redirect(`/usuario/${usuario.id}`);

    } else {
      return res.render('usuario_login', {
        title: 'Login de Usuario',
        message: 'Senha e Email invalida.',
        anoAtual
      });
    }
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).send('Erro interno do servidor');
  }
});

router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); 
    const postagensAll = await select_postagem_ativo();
    const usuario = await select_usuario_id(id); 
    const anoAtual = new Date().getFullYear(); 

    if (usuario) {
      res.render('index_usuario.pug', {
        title: 'Index Usuario',
        users: usuario,
        postagens: postagensAll, 
        anoAtual,
        verificacao: true  
      });
    } else {
      res.render('index_usuario.pug', {
        title: 'Index Usuario Desativado',
        users: null,
        verificacao: false  
      });
    }
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

router.post('/', async function(req, res, next) {

  const { nome, email, senha, senha1 } = req.body;
  const anoAtual = new Date().getFullYear(); 

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
      vnome: nome.trim(),
      vemail: email.trim(),
      vsenha: senhaHash,
      dt_cadastro: new Date(),
      vativo: true
    };

    const cadastro = await insert_table_usuario(novoUsuario);

    if (cadastro) {
      res.render('usuario_create', {
        title: 'Usuario Cadastro',
        verificacao: true,
        message: 'Cadastrado com Sucesso..',
        anoAtual
      });
    } else {
      res.render('usuario_create', {
        title: 'Usuario Cadastro',
        verificacao: false,
        message: 'Erro ao inserir usuário.',
        anoAtual
      });
    }
  } catch (err) {
    console.error('Erro ao cadastrar usuário:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

module.exports = router;