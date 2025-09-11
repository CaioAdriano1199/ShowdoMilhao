// Carrega o mock de perguntas
const perguntas = [
  {
    pergunta: "Qual é a capital do Brasil?",
    correta: "Brasília",
    erradas: ["Rio de Janeiro", "São Paulo", "Salvador"]
  },
  {
    pergunta: "Quem pintou a Mona Lisa?",
    correta: "Leonardo da Vinci",
    erradas: ["Michelangelo", "Van Gogh", "Pablo Picasso"]
  },
  {
    pergunta: "Qual o planeta mais próximo do Sol?",
    correta: "Mercúrio",
    erradas: ["Vênus", "Marte", "Saturno"]
  }
  // adiciona até 15 no total
];

// Embaralhar array
function embaralhar(array) {
  return array.sort(() => Math.random() - 0.5);
}

let perguntasEmbaralhadas = embaralhar([...perguntas]);
let indiceAtual = 0;

const perguntaEl = document.getElementById("pergunta");
const alternativasEl = document.getElementById("alternativas");
const proximaBtn = document.getElementById("proxima");

function mostrarPergunta() {
  // limpa alternativas anteriores
  alternativasEl.innerHTML = "";
  proximaBtn.style.display = "none";

  let q = perguntasEmbaralhadas[indiceAtual];
  perguntaEl.textContent = q.pergunta;

  // junta correta e erradas, depois embaralha
  let respostas = embaralhar([q.correta, ...q.erradas]);

  respostas.forEach(resp => {
    let btn = document.createElement("button");
    btn.textContent = resp;
    btn.onclick = () => verificarResposta(resp, q.correta, btn);
    alternativasEl.appendChild(btn);
  });
}

function verificarResposta(resposta, correta, botao) {
  let botoes = alternativasEl.querySelectorAll("button");

  botoes.forEach(b => {
    b.disabled = true;
    if (b.textContent === correta) {
      b.style.background = "green";
    } else if (b.textContent === resposta) {
      b.style.background = "red";
    }
  });

  proximaBtn.style.display = "block";
}

proximaBtn.onclick = () => {
  indiceAtual++;
  if (indiceAtual < perguntasEmbaralhadas.length) {
    mostrarPergunta();
  } else {
    perguntaEl.textContent = "Fim do jogo!";
    alternativasEl.innerHTML = "";
    proximaBtn.style.display = "none";
  }
};

// Seletores dos modais
const modalConfirmacao = document.getElementById("modal-confirmacao");
const modalCorreta = document.getElementById("modal-correta");
const modalErrada = document.getElementById("modal-errada");

const confirmarBtn = document.getElementById("confirmar");
const cancelarBtn = document.getElementById("cancelar");
const proximaCorretaBtn = document.getElementById("proxima-correta");
const proximaErradaBtn = document.getElementById("proxima-errada");

let respostaSelecionada = null;
let respostaCorreta = null;

function mostrarPergunta() {
  alternativasEl.innerHTML = "";
  
  let q = perguntasEmbaralhadas[indiceAtual];
  perguntaEl.textContent = q.pergunta;

  respostaCorreta = q.correta;

  let respostas = embaralhar([q.correta, ...q.erradas]);

  respostas.forEach(resp => {
    let btn = document.createElement("button");
    btn.textContent = resp;
    btn.onclick = () => abrirModalConfirmacao(resp, q.correta);
    alternativasEl.appendChild(btn);
  });
}

function abrirModalConfirmacao(resp, correta) {
  respostaSelecionada = resp;
  respostaCorreta = correta;
  document.getElementById("modal-text").textContent = `Você confirma a resposta: "${resp}"?`;
  modalConfirmacao.style.display = "flex";
}

// Confirma a escolha
confirmarBtn.onclick = () => {
  modalConfirmacao.style.display = "none";
  if (respostaSelecionada === respostaCorreta) {
    modalCorreta.style.display = "flex";
  } else {
    modalErrada.style.display = "flex";
  }
};

// Cancela a escolha
cancelarBtn.onclick = () => {
  modalConfirmacao.style.display = "none";
};

// Próxima pergunta (se acertou)
proximaCorretaBtn.onclick = () => {
  modalCorreta.style.display = "none";
  proximaPergunta();
};

// Próxima pergunta (se errou)
proximaErradaBtn.onclick = () => {
  modalErrada.style.display = "none";
  proximaPergunta();
};

function proximaPergunta() {
  indiceAtual++;
  if (indiceAtual < perguntasEmbaralhadas.length) {
    mostrarPergunta();
  } else {
    perguntaEl.textContent = "🏆 Fim do jogo!";
    alternativasEl.innerHTML = "";
  }
}

const ajudaBtn = document.getElementById("ajuda5050");
let ajudaUsada = false;


function mostrarPergunta() {
  alternativasEl.innerHTML = "";

  let q = perguntasEmbaralhadas[indiceAtual];
  perguntaEl.textContent = q.pergunta;

  // salva a correta da rodada
  respostaCorreta = q.correta;

  let respostas = embaralhar([q.correta, ...q.erradas]);

  respostas.forEach(resp => {
    let btn = document.createElement("button");
    btn.textContent = resp;
    btn.classList.add("alternativa");
    btn.onclick = () => abrirModalConfirmacao(resp, q.correta);
    alternativasEl.appendChild(btn);
  });
}


// Botão 50/50
ajudaBtn.onclick = () => {
  if (ajudaUsada) return; // só pode usar uma vez
  ajudaUsada = true;
  ajudaBtn.disabled = true;

  let botoes = Array.from(document.querySelectorAll(".alternativa"));
  // pega somente as erradas
  let erradas = botoes.filter(b => b.textContent !== respostaCorreta);

  // embaralha e remove 2 erradas
  embaralhar(erradas).slice(0, 2).forEach(b => {
    b.style.display = "none";
  });
};



// iniciar jogo
mostrarPergunta();
