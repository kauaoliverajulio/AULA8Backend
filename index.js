const express = require("express");
const fs = require("fs");
const cors    = require('cors');
const app = express();
const PORT = 3000;


app.use(cors());
app.use(express.static('public'));      
// Middleware para CORS (permitir requisições do navegador)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(express.json());

// ============================
// FUNÇÕES DE ARQUIVO (JSON)
// ============================

// Lê o arquivo alunos.json e transforma em array de objetos
function lerAlunos() {
  const dados = fs.readFileSync("alunos.json", "utf-8");
  return JSON.parse(dados);
}

// Salva o array de alunos no alunos.json (formatado bonitinho)
function salvarAlunos(alunos) {
  fs.writeFileSync("alunos.json", JSON.stringify(alunos, null, 2));
}

// Gera o próximo ID de forma segura (não depende do length)
function proximoId(alunos) {
  if (alunos.length === 0) return 1;
  const maiorId = Math.max(...alunos.map((a) => a.id));
  return maiorId + 1;
}

// ============================
// ROTAS
// ============================

// Rota inicial (teste rápido)
app.get("/", (req, res) => {
  res.send("API Escola funcionando!");
});

// GET /alunos -> lista todos
app.get("/alunos", (req, res) => {
  const alunos = lerAlunos();
  res.json(alunos);
});

// GET /alunos/:id -> buscar por ID
app.get("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const alunos = lerAlunos();

  const aluno = alunos.find((a) => a.id === id);

  if (!aluno) {
    return res.status(404).json({ mensagem: "Aluno não encontrado!" });
  }

  res.json(aluno);
});

// POST /alunos -> cadastrar
app.post("/alunos", (req, res) => {
  const { nome, idade } = req.body;

  if (!nome || idade === undefined) {
    return res.status(400).json({
      mensagem: "Envie nome e idade no corpo da requisição!",
      exemplo: { nome: "Ana", idade: 16 },
    });
  }

  const alunos = lerAlunos();

  const novo = {
    id: proximoId(alunos),
    nome: String(nome),
    idade: Number(idade),
  };

  alunos.push(novo);
  salvarAlunos(alunos);

  res.status(201).json(novo);
});

// PUT /alunos/:id -> atualizar
app.put("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { nome, idade } = req.body;

  const alunos = lerAlunos();
  const index = alunos.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ mensagem: "Aluno não encontrado!" });
  }

  const alunoAtual = alunos[index];

  alunos[index] = {
    id,
    nome: nome !== undefined ? String(nome) : alunoAtual.nome,
    idade: idade !== undefined ? Number(idade) : alunoAtual.idade,
  };

  salvarAlunos(alunos);
  res.json(alunos[index]);
});

// DELETE /alunos/:id -> remover
app.delete("/alunos/:id", (req, res) => {
  const id = Number(req.params.id);

  const alunos = lerAlunos();
  const existe = alunos.some((a) => a.id === id);

  if (!existe) {
    return res.status(404).json({ mensagem: "Aluno não encontrado!" });
  }

  const filtrado = alunos.filter((a) => a.id !== id);
  salvarAlunos(filtrado);

  res.json({ mensagem: "Aluno removido!" });
});

// ============================
// INICIAR SERVIDOR
// ============================
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
