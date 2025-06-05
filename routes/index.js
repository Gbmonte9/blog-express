var express = require('express');
var router = express.Router();
const { ensureDatabaseExists, select_postagem_all } = require('../db'); 


router.get('/', async (req, res) => {
  try {
    await ensureDatabaseExists();
    const postagens = await select_postagem_all();
    const anoAtual = new Date().getFullYear(); 
    res.render('index', { title: 'Home', postagens, anoAtual });
  } catch (err) {
    console.error('Erro ao carregar a página inicial:', err);
    res.status(500).send('Erro no servidor');
  }
});

module.exports = router;
