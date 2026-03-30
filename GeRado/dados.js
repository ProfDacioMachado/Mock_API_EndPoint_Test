const produtosDB = {
  "123": { nome: "Arroz", preco: 20 },
  "456": { nome: "Feijão", preco: 8 },
  "789": { nome: "Leite", preco: 5 }
};


let carrinho = [];


const audio = new Audio("beep-07.mp3");


window.onload = () => {
  document.getElementById("codigo").focus();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    adicionarProduto();
  }
});

function adicionarProduto() {
  const codigoInput = document.getElementById("codigo");
  const qtdInput = document.getElementById("quantidade");

  const codigo = codigoInput.value;
  const quantidade = parseInt(qtdInput.value);

  if (!produtosDB[codigo]) {
     AlertItem();
    return;
  }

  const produtoBase = produtosDB[codigo];

  const item = {
    nome: produtoBase.nome,
    preco: produtoBase.preco,
    quantidade: quantidade,
    subtotal: produtoBase.preco * quantidade
  };

  carrinho.push(item);
  audio.currentTime = 0;
  audio.play();

  atualizarTela();

  codigoInput.value = "";
  qtdInput.value = 1;

  codigoInput.focus();
}

function atualizarTela() {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";

  let total = 0;

  carrinho.forEach((item, index) => {
    total += item.subtotal;

    const li = document.createElement("li");
    li.className = "list-group-item";

    li.innerHTML = `
      <div class="d-flex justify-content-between">
        <strong>${item.nome}</strong>
        <button class="btn btn-sm btn-danger" onclick="removerItem(${index})">X</button>
      </div>
      <small>
        ${item.quantidade} x R$ ${item.preco.toFixed(2)} = 
        <strong>R$ ${item.subtotal.toFixed(2)}</strong>
      </small>
    `;

    lista.appendChild(li);
  });


  document.getElementById("total").textContent = total.toFixed(2);
  
  document.getElementById("ValXUn").textContent = item.subtotal.toFixed(2);
}

function removerItem(index) {
  carrinho.splice(index, 1);
  atualizarTela();
}

function AlertItem() {
    const container = document.getElementById("Alert");

    container.innerHTML = "";

    container.innerHTML = ` 
        <div class="modal" id="exampleModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">

                    <div class="modal-header">
                        <h1 class="modal-title fs-5">Item não encontrado</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>

                    <div class="modal-body">
                        O código de barras digitado não foi encontrado.
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                            Fechar
                        </button>
                    </div>

                </div>
            </div>
        </div> 
    `;


        const modalElement = document.getElementById('exampleModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
}


function atualizarDataHora() {
  const agora = new Date();

  const formatado = agora.toLocaleString("pt-BR");
  document.getElementById("dataHora").textContent = formatado;
}

setInterval(atualizarDataHora, 1000);
atualizarDataHora();


async function obterLocalizacao() {
  try {
    const res = await fetch("https://ipapi.co/json/");
    const data = await res.json();

    const cidade = data.city;
    const estado = data.region;

    document.getElementById("local").textContent = `${cidade} - ${estado}`;
  } catch (erro) {
    document.getElementById("local").textContent = "Não disponível";
  }
}

obterLocalizacao();