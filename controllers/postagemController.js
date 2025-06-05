const fs = require('fs');
const path = require('path');
const { createDbClient } = require('../dbClient');

async function select_postagem_id(postagem_id) {
  
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'postagem', 'select_table_postagem_id.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql, [postagem_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar postagem por ID:', err);
    return null;
  } finally {
    await client.end();
  }
}

//continuaão
async function select_postagem_ativo() {
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'postagem', 'select_table_postagem_ativo.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql);
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar todas as postagens_ativa:', err);
    return [];
  } finally {
    await client.end();
  }
}

async function select_postagem_all() {
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'postagem', 'select_table_postagem_all.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql);
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar todos os postagem:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function insert_table_postagem({id, titulo, descricao, dt_cadastro, ativo, usuario_id}) {
  
  const client = createDbClient();

  try {

    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'postagem', 'insert_table_postagem.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const values = [id, titulo, descricao, dt_cadastro, ativo, usuario_id];

    const result = await client.query(sql, values);

    return result.rowCount > 0;

  } catch (err) {
    console.error('Erro ao inserir postagem:', err);
    return false;
  } finally {
    await client.end();
  }
}

module.exports = {
  select_postagem_id,
  select_postagem_all,
  insert_table_postagem,
  select_postagem_ativo
};