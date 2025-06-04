const bcrypt = require('bcrypt');

const saltRounds = 10; // Quantidade de rounds para gerar o salt

// Função para gerar o hash da senha
async function hashPassword(senha) {
  try {
    const hash = await bcrypt.hash(senha, saltRounds);
    return hash;
  } catch (err) {
    console.error('Erro ao gerar hash:', err);
    throw err;
  }
}

// Função para comparar a senha com o hash
async function comparePassword(senha, hash) {
  try {
    const match = await bcrypt.compare(senha, hash);
    return match; // true ou false
  } catch (err) {
    console.error('Erro ao comparar senha:', err);
    throw err;
  }
}

module.exports = { hashPassword, comparePassword };