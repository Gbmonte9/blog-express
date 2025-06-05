var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_usuario_id, insert_table_usuario, select_usuario_email } = require('../db'); // Ajustar caminho se necessário
const { v4: uuidv4 } = require('uuid');
const { hashPassword, comparePassword } = require('../bcrypt');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('usuario_create', { title: 'Cadastro' });
});

/* GET home page. */
router.get('/login', function(req, res, next) {
  res.render('usuario_login', { title: 'Login' });
});

router.post('/usuario/login', async (req, res, next) => {
  const { email, senha } = req.body;

  try {
    await ensureDatabaseExists(); // Garante que o banco e as tabelas existem
    const usuario = await select_usuario_email(email); // Busca o usuário pelo e-mail

    // Se não encontrou o usuário
    if (!usuario) {
      return res.render('usuario_login', {
        title: 'Login',
        message: 'Email ou senha inválidos.',
      });
    }

    // Compara a senha com o hash salvo
    const senhaCorreta = await comparePassword(usuario.senha, senha);

    if (senhaCorreta) {
      // Sucesso: redireciona
      return res.redirect(`/${usuario.id}`);
    } else {
      // Senha incorreta
      return res.render('usuario_login', {
        title: 'Login',
        message: 'Email ou senha inválidos.',
      });
    }
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).send('Erro interno do servidor');
  }
});

/* GET usuário por ID */
router.get('/:id', async function(req, res, next) {
  const id = req.params.id;

  try {
    await ensureDatabaseExists(); // garante que o banco e tabelas existam
    const postagens = await select_postagem_all();
    const usuario = await select_usuario_id(id); // espera os dados do usuário
    const anoAtual = new Date().getFullYear(); // pega o ano atual

    if (usuario) {
      res.render('index_usuario.pug', {
        title: 'Index Usuario',
        users: usuario,
        postagens: listaPostagens, 
        anoAtual,
        verificacao: true  // corrigido aqui
      });
    } else {
      res.render('index_usuario.pug', {
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
      vnome: nome.trim(),
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