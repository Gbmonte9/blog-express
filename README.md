
# 📝 Projeto Blog - Node.js + PostgreSQL

Este é um projeto de Blog (em desenvolvimento mas pdoe ser usado) desenvolvido com **Node.js**, **Express**, **PostgreSQL** e **Pug**. O sistema permite que usuários se cadastrem, criem postagens e comentem, com validações de acesso e estrutura de banco de dados totalmente automatizada (ainda esta em desenvolvimento, então futuramente iremos colcoar essa funcionalidade).

---

## 🚀 Funcionalidades

- 📌 Criação automática do banco e das tabelas (`usuario`, `postagem`, `comentario`)
- 👤 Cadastro e login de usuários
- ✍️ Criação de postagens somente para usuários autenticados
- 💬 Comentários permitidos apenas para usuários cadastrados
- 📄 Visualização de postagens com comentários em tempo real

---

## 🛠️ Tecnologias

- Node.js
- Express
- PostgreSQL
- Pug (template engine)
- SQL puro com `fs.readFileSync`
- UUID para chaves primárias
- Bcrypt para criptografia.

---

## 🔐 Requisitos

- Node.js instalado
- PostgreSQL rodando na máquina
- Altere a senha do PostgreSQL em `db.js` se necessário:

```js
const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'blog',
  password: '1234', // 🔧 Altere conforme sua senha local
  port: 5432,
});
```

---

## 🧭 Rotas do Projeto

| Rota | Método | Descrição |
|------|--------|-----------|
| `/` | `GET` | Página inicial. Inicia a verificação/criação do banco de dados |
| `/usuario` | `GET / POST` | Exibe usuários e permite cadastrar um novo |
| `/postagem/` | `GET ` | Exibe postagens do usuário |
| `/usuario/login` | `GET / POST` | Tela de login do usuário |
| `/postagem/usuario/:id` | `GET / POST` | Exibe postagens do usuário e permite criar novas |
| `/postagem/:postId/usuario/:userId` | `GET` | Visualiza detalhes de uma postagem e seus comentários |
| `/comentario/postagem/:postId/usuario/:userId` | `POST` | Envia um comentário para a postagem, apenas se o usuário estiver cadastrado |

---

## ⚙️ Como Rodar o Projeto

```bash
# 1. Clone o repositório
git clone https://github.com/Gbmonte9/blog-express.git
cd blog-express

# 2. Instale as dependências
npm install

# 3. Inicie o servidor
npm start
```

Acesse:  
👉 `http://localhost:3000`

---

## 🧪 Regras de Negócio

- ✅ Somente usuários **cadastrados** podem criar postagens e comentar
- ✅ Comentários são vinculados à **postagem** e ao **usuário**
- ✅ Visualização de comentários está embutida no detalhe da postagem

---

## 📁 Organização

```
/controllers
  /comentarioController.js
  /postagemController.js
  /usuarioController.js
/sql
  /bd
  /usuario
  /postagem
  /comentario
/routes
/views
/db.js
/dbClient.js
/app.js
```

---

## 👨‍💻 Autor

**Gabriel Monte**  
[LinkedIn](https://www.linkedin.com/in/gabriel-rodrigues-mt)  
✉️ gabrielmonte485@gmail.com

---

## 📝 Licença

Este projeto é open-source e pode ser utilizado para fins acadêmicos, pessoais ou profissionais.
