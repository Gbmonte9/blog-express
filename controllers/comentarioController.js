const fs = require('fs');
const path = require('path');
const { createDbClient } = require('../dbClient');

async function select_comentario_id(comenatrio_id) {
  
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'comentario', 'select_table_comentario_id.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql, [comenatrio_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar comentario por ID:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function select_comentario_all() {
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'comentario', 'select_table_comentario_all.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql);
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar todos os comentario:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function insert_table_comentario({id, descricao, dt_cadastro, dt_cadastro, ativo, cod_postagem, cod_usuario}) {
  
  const client = createDbClient();

  try {

    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'comentario', 'insert_table_comentario.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const values = [id, descricao, dt_cadastro, dt_cadastro, ativo, cod_postagem, cod_usuario];

    const result = await client.query(sql, values);

    return result.rowCount > 0;

  } catch (err) {
    console.error('Erro ao inserir comentario:', err);
    return false;
  } finally {
    await client.end();
  }
}

module.exports = {
  select_comentario_id,
  select_comentario_all,
  insert_table_comentario
};