const bcrypt = require('bcrypt');

const saltRounds = 10; 

async function hashPassword(senha) {
  try {
    const hash = await bcrypt.hash(senha, saltRounds);
    return hash;
  } catch (err) {
    console.error('Erro ao gerar hash:', err);
    throw err;
  }
}

async function comparePassword(senha, hash) {
  try {
    const match = await bcrypt.compare(senha, hash);
    return match; 
  } catch (err) {
    console.error('Erro ao comparar senha:', err);
    throw err;
  }
}

module.exports = { hashPassword, comparePassword };