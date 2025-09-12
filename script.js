// =======================
// VARIÁVEIS PRINCIPAIS
// =======================
function embaralhar(array) { return array.sort(() => Math.random() - 0.5); }

let perguntas = [];
let perguntasEmbaralhadas = [];
let indiceAtual = 0;
let pontuacao = 0;
let valoresPerguntas = [1000, 2000, 5000, 10000, 20000, 30000, 40000, 50000, 100000, 200000, 300000, 400000, 500000, 750000, 1000000];
let respostaSelecionada = null;
let respostaCorreta = null;
let ajudaUsada = false;
let pulosRestantes = 2;
let universitariosUsado = false;

// =======================
// ELEMENTOS DOM
// =======================
const perguntaEl = document.getElementById("pergunta");
const alternativasEl = document.getElementById("alternativas");
const pontuacaoEl = document.getElementById("pontuacao");
const valorPerguntaEl = document.getElementById("valorPergunta");
const ajudaBtn = document.getElementById("ajuda5050");
const pularBtn = document.getElementById("pular");
const universitariosBtn = document.getElementById("universitarios");

const modalConfirmacao = document.getElementById("modal-confirmacao");
const modalCorreta = document.getElementById("modal-correta");
const modalErrada = document.getElementById("modal-errada");

const confirmarBtn = document.getElementById("confirmar");
const cancelarBtn = document.getElementById("cancelar");
const proximaCorretaBtn = document.getElementById("proxima-correta");
const proximaErradaBtn = document.getElementById("proxima-errada");

const telaInicial = document.getElementById("tela-inicial");
const jogo = document.getElementById("jogo");
const iniciarBtn = document.getElementById("iniciar");
const instrucoesBtn = document.getElementById("instrucoesBtn");
const modalInstrucoes = document.getElementById("modal-instrucoes");
const fecharInstrucoesBtn = document.getElementById("fecharInstrucoes");

// =======================
// CARREGAR PERGUNTAS EXTERNAS
// =======================
async function carregarPerguntas() {
  try {
    const response = await fetch("perguntas.json"); // seu arquivo JSON
    if (!response.ok) throw new Error("Não foi possível carregar as perguntas.");
    perguntas = await response.json();
    perguntasEmbaralhadas = embaralhar([...perguntas]);
  } catch (error) {
    console.error(error);
    alert("Erro ao carregar perguntas.");
  }
}

// =======================
// FUNÇÕES PRINCIPAIS
// =======================
function atualizarStatus() {
  pontuacaoEl.textContent = pontuacao;
  valorPerguntaEl.textContent = valoresPerguntas[indiceAtual] || 0;
}

function mostrarPergunta() {
  alternativasEl.innerHTML = "";

  let q = perguntasEmbaralhadas[indiceAtual];
  perguntaEl.textContent = q.pergunta;
  respostaCorreta = q.correta;

  let respostas = embaralhar([q.correta, ...q.erradas]);
  respostas.forEach(resp => {
    let btn = document.createElement("button");
    btn.textContent = resp;
    btn.classList.add("alternativa");
    btn.onclick = () => abrirModalConfirmacao(resp, q.correta);
    alternativasEl.appendChild(btn);
  });

  atualizarStatus();
}

// =======================
// MODAIS
// =======================
function abrirModalConfirmacao(resp, correta) {
  respostaSelecionada = resp;
  respostaCorreta = correta;
  document.getElementById("modal-text").textContent = `Você confirma a resposta: "${resp}"?`;
  modalConfirmacao.style.display = "flex";
}

confirmarBtn.onclick = () => {
  modalConfirmacao.style.display = "none";
  if (respostaSelecionada === respostaCorreta) {
    modalCorreta.style.display = "flex";
  } else {
    modalErrada.style.display = "flex";
  }
};

cancelarBtn.onclick = () => { modalConfirmacao.style.display = "none"; };

proximaCorretaBtn.onclick = () => {
  modalCorreta.style.display = "none";
  pontuacao += valoresPerguntas[indiceAtual];
  proximaPergunta();
};

proximaErradaBtn.onclick = () => {
  modalErrada.style.display = "none";
  reiniciarJogo();
};

// =======================
// FUNÇÕES DE JOGO
// =======================
function proximaPergunta() {
  indiceAtual++;
  if (indiceAtual < perguntasEmbaralhadas.length) {
    mostrarPergunta();
  } else {
    perguntaEl.textContent = "🏆 Parabéns! Você chegou a 1 milhão!";
    alternativasEl.innerHTML = "";
  }
}

function reiniciarJogo() {
  indiceAtual = 0;
  pontuacao = 0;
  perguntasEmbaralhadas = embaralhar([...perguntas]);
  mostrarPergunta();

  ajudaUsada = false;
  ajudaBtn.disabled = false;

  pulosRestantes = 2;
  pularBtn.textContent = "🐇 Pular Pergunta (2)";
  pularBtn.disabled = false;

  universitariosUsado = false;
  universitariosBtn.disabled = false;

  atualizarStatus();
}

// =======================
// AJUDAS
// =======================
ajudaBtn.onclick = () => {
  if (ajudaUsada) return;
  ajudaUsada = true;
  ajudaBtn.disabled = true;

  let botoes = Array.from(document.querySelectorAll(".alternativa"));
  let erradas = botoes.filter(b => b.textContent !== respostaCorreta);
  embaralhar(erradas).slice(0, 2).forEach(b => b.style.display = "none");
};

pularBtn.onclick = () => {
  if (pulosRestantes > 0) {
    pulosRestantes--;
    pularBtn.textContent = `🐇 Pular Pergunta (${pulosRestantes})`;
    proximaPergunta();
    if (pulosRestantes === 0) pularBtn.disabled = true;
  }
};

universitariosBtn.onclick = () => {
  if (universitariosUsado) return;
  universitariosUsado = true;
  universitariosBtn.disabled = true;

  let botoes = Array.from(document.querySelectorAll(".alternativa"))
    .filter(b => b.style.display !== "none");

  let chanceAcerto = Math.random() < 0.75;
  let sugestao = chanceAcerto
    ? respostaCorreta
    : botoes.filter(b => b.textContent !== respostaCorreta)[Math.floor(Math.random() * (botoes.filter(b => b.textContent !== respostaCorreta).length))].textContent;

  alert(`Os universitários sugerem a opção: "${sugestao}"`);
};

// =======================
// TELA INICIAL
// =======================
iniciarBtn.onclick = async () => {
  telaInicial.style.display = "none";
  jogo.style.display = "block";
  await carregarPerguntas();
  mostrarPergunta();
};

instrucoesBtn.onclick = () => { modalInstrucoes.style.display = "flex"; };
fecharInstrucoesBtn.onclick = () => { modalInstrucoes.style.display = "none"; };

window.onclick = (e) => {
  if (e.target === modalInstrucoes) modalInstrucoes.style.display = "none";
};
