const express = require('express');
const fs = require('fs');
const path = require('path');
const { createDbClient } = require('./dbClient.js');
const usuarioController = require('./controllers/usuarioController.js');
const postagemController = require('./controllers/postagemController.js');
const comentarioController = require('./controllers/comentarioController.js');


const app_blog = 'app_blog';  

async function ensureDatabaseExists() {
 
  const defaultClient = createDbClient('app_blog');

  try {
    await defaultClient.connect();

    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [app_blog]
    );

    if (res.rowCount === 0) {
      const sqlPath = path.join(__dirname, 'sql', 'bd', 'create_databd.sql');
      const createDbSql = fs.readFileSync(sqlPath, 'utf-8');
      await defaultClient.query(createDbSql);
      console.log(`Banco de dados "${app_blog}" criado com sucesso.`);
    } else {
      console.log(`Banco de dados "${app_blog}" já existe.`);
    }
  } catch (err) {
    console.error('Erro ao verificar/criar banco de dados:', err);
    return;
  } finally {
    await defaultClient.end();
  }

  // Agora conecta no banco app_blog para criar as tabelas
  const client = createDbClient(app_blog);

  try {
    await client.connect();

    // Supondo que essas funções recebam o client e criem as tabelas
    await createUsuarioTable(client);
    await createPostagemTable(client);
    await createComentarioTable(client);

  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    await client.end();
  }

}

async function select_usuario_id(usuario_id) {
  const usuario = await usuarioController.select_usuario_id(usuario_id);
  return usuario;
}

async function select_usuario_email(usuario_email) {
  const usuario = await usuarioController.select_usuario_email(usuario_email);
  return usuario;
}

async function select_usuario_all() {
  const usuarios = await usuarioController.select_usuario_all();
  return usuarios;
}

async function insert_table_usuario({ vid, vnome, vemail, vsenha, dt_cadastro, vativo }) {
  try {
    const resultado = await usuarioController.insert_table_usuario({ vid, vnome, vemail, vsenha, dt_cadastro, vativo });
    return resultado ? true : false; // true se inseriu, false se não
  } catch (error) {
    console.error('Erro no insert_table_usuario:', error);
    return false; // falha ao inserir
  }
}

async function select_postagem_id(postagem_id) {
  const postagem = await postagemController.select_postagem_id(postagem_id);
  return postagem;
}

async function select_postagem_all() {
  const postagem = await postagemController.select_postagem_all();
  return postagem;
}

async function insert_table_postagem({ id, titulo, descricao, dt_cadastro, ativo, usuario_id }) {
  try {
    const resultado = await postagemController.insert_table_postagem({ id, titulo, descricao, dt_cadastro, ativo, usuario_id });
    return resultado ? true : false; // true se inseriu, false se não
  } catch (error) {
    console.error('Erro no insert_table_postagem:', error);
    return false; // falha ao inserir
  }
}

async function select_comentario_id(comentario_id) {
  const comentario = await comentarioController.select_comentario_id(comentario_id);
  return comentario;
}

async function select_comentario_postagemId(postagem_id) {
  const comentario = await comentarioController.select_comentario_postagemId(postagem_id);
  return comentario;
}

async function insert_table_comentario({id, descricao, dt_cadastro, ativo, cod_postagem, cod_usuario}) {
  try {
    const resultado = await comentarioController.insert_table_comentario({ id, descricao, dt_cadastro, ativo, cod_postagem, cod_usuario });
    return resultado ? true : false; // true se inseriu, false se não
  } catch (error) {
    console.error('Erro no insert_table_comentario:', error);
    return false; // falha ao inserir
  }
}

async function createUsuarioTable(client) {
  
  try {
    // Verifica se a tabela já existe
    const checkTable = await client.query(`
      SELECT to_regclass('public.usuario') AS table_exists;
    `);

    if (checkTable.rows[0].table_exists) {
      console.log('Tabela "usuario" já existe.');
      return;
    }

    // Se não existir, lê e executa o script para criar a tabela
    const sqlPath = path.join(__dirname, 'sql', 'usuario', 'create_table_usuario.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');
    await client.query(createTableSql);
    console.log('Tabela "usuario" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "usuario":', err);
  }
}

// Tabela Postagem
async function createPostagemTable(client) {
  try {

    // Verifica se a tabela já existe
    const checkTable = await client.query(`
      SELECT to_regclass('public.postagem') AS table_exists;
    `);

    if (checkTable.rows[0].table_exists) {
      console.log('Tabela "postagem" já existe.');
      return;
    }

    const sqlPath = path.join(__dirname, 'sql', 'postagem', 'create_table_postagem.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');
    await client.query(createTableSql);
    console.log('Tabela "postagem" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "postagem":', err);
  }
}

// Tabela Comentario
async function createComentarioTable(client) {
  try {

    // Verifica se a tabela já existe
    const checkTable = await client.query(`
      SELECT to_regclass('public.comentario') AS table_exists;
    `);

    if (checkTable.rows[0].table_exists) {
      console.log('Tabela "comentario" já existe.');
      return;
    }  

    const sqlPath = path.join(__dirname, 'sql', 'comentario', 'create_table_comentario.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');
    await client.query(createTableSql);
    console.log('Tabela "comentario" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "comentario":', err);
  }
}

module.exports = { 
  ensureDatabaseExists, 
  select_usuario_id, 
  select_usuario_email,
  select_usuario_all, 
  insert_table_usuario,
  insert_table_postagem,
  insert_table_comentario,
  select_postagem_id,
  select_comentario_id,
  select_postagem_all,
  select_comentario_postagemId
};
