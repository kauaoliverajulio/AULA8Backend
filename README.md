# API Escola - Backend Puro

Este é o ponto de partida para o desenvolvimento do frontend.

## O que já existe aqui
- Backend completo com todas as rotas CRUD
- `GET /alunos` — lista todos os alunos
- `GET /alunos/:id` — busca um aluno por ID
- `POST /alunos` — cadastra um novo aluno
- `PUT /alunos/:id` — atualiza um aluno
- `DELETE /alunos/:id` — remove um aluno

## Como rodar
```bash
npm install
node index.js
```

## Próximo passo (Aula 8)
- Adicionar `const path = require("path")`
- Adicionar `app.use(express.static(...))` para servir HTML
- Criar a pasta `public/` com o `index.html`
