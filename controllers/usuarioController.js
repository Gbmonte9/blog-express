const fs = require('fs');
const path = require('path');
const { createDbClient } = require('../dbClient');

async function select_usuario_id(usuario_id) {
  
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'usuario', 'select_table_usuario_id.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql, [usuario_id]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar usuário por ID:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function select_usuario_email(email) {
  
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'usuario', 'select_table_usuario_email.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql, [email]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar usuário por Email:', err);
    return null;
  } finally {
    await client.end();
  }
}

// continuação
async function select_usuario_email_e_ativo(email) {
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'usuario', 'select_table_usuario_email_e_ativo.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql, [email]);
    return result.rows[0];
  } catch (err) {
    console.error('Erro ao buscar usuário por Email_ativo:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function select_usuario_all() {
  const client = createDbClient();

  try {
    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'usuario', 'select_table_usuario_all.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const result = await client.query(sql);
    return result.rows;
  } catch (err) {
    console.error('Erro ao buscar todos os usuários:', err);
    return null;
  } finally {
    await client.end();
  }
}

async function insert_table_usuario({ vid, vnome, vemail, vsenha, dt_cadastro, vativo }) {
  
  const client = createDbClient();

  try {

    await client.connect();

    const sqlPath = path.join(__dirname, '..', 'sql', 'usuario', 'insert_table_usuario.sql');
    const sql = fs.readFileSync(sqlPath, 'utf-8');

    const values = [vid, vnome, vemail, vsenha, dt_cadastro, vativo];

    const result = await client.query(sql, values);

    return result.rowCount > 0;

  } catch (err) {
    console.error('Erro ao inserir usuário:', err);
    return false;
  } finally {
    await client.end();
  }
}

module.exports = {
  select_usuario_id,
  select_usuario_all,
  insert_table_usuario,
  select_usuario_email,
  select_usuario_email_e_ativo
};