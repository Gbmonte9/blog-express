const express = require('express'); // faltava isso
const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const bd = express(); // agora está correto

const defaultClient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'app_blog',
  password: '123',
  port: 5432,
});

const app_blog = 'app_blog';

async function ensureDatabaseExists() {
  try {
    await defaultClient.connect();

    const res = await defaultClient.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [app_blog]
    );

    if (res.rowCount === 0) {
      const sqlPath = path.join(__dirname, 'sql', 'create_databd.sql');
      const createDbSql = fs.readFileSync(sqlPath, 'utf-8');
      await defaultClient.query(createDbSql);
      console.log(`Banco de dados "${app_blog}" criado com sucesso.`);
    } else {
      console.log(`Banco de dados "${app_blog}" já existe.`);
    }
    
    await createUsuarioTable();
    await createPostagemTable();
    await createComentarioTable();

  } catch (err) {
    console.error('Erro ao verificar ou criar o banco de dados:', err);
  } finally {
    await defaultClient.end();
  }
}

// Tabela Usuario
async function createUsuarioTable() {
  try {
    await defaultClient.connect();

    const sqlPath = path.join(__dirname, 'sql', 'create_table_usuario.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');

    await defaultClient.query(createTableSql);
    console.log('Tabela "usuario" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "usuario":', err);
  } finally {
    await defaultClient.end();
  }
}

// Tabela Postagem
async function createPostagemTable() {
  try {
    await defaultClient.connect();

    const sqlPath = path.join(__dirname, 'sql', 'create_table_postagem.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');

    await defaultClient.query(createTableSql);
    console.log('Tabela "postagem" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "postagem":', err);
  } finally {
    await defaultClient.end();
  }
}

// Tabela Comenatrio
async function createComentarioTable() {
  try {
    await defaultClient.connect();

    const sqlPath = path.join(__dirname, 'sql', 'create_table_comentario.sql');
    const createTableSql = fs.readFileSync(sqlPath, 'utf-8');

    await defaultClient.query(createTableSql);
    console.log('Tabela "comentario" criada com sucesso.');
  } catch (err) {
    console.error('Erro ao criar tabela "comentario":', err);
  } finally {
    await defaultClient.end();
  }
}

ensureDatabaseExists();

module.exports = bd;