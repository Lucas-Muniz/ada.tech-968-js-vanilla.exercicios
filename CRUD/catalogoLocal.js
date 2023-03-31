function saveLocal(lista) {
  localStorage.setItem("@catalogo", JSON.stringify(lista));
}

function getLocal() {
  return JSON.parse(localStorage.getItem("@catalogo")) || [];
}

function criaLista(list) {
  function onclickRemove(item) {
    let catalogo = list.reduce((acc, itemCatalogo) => {
      if (itemCatalogo.prato !== item.prato) {
        acc.push(itemCatalogo);
      }
      return acc;
    }, []);
    saveLocal(catalogo);
    criaLista(catalogo);
  }

  const catalogo = document.querySelector("ul");
  catalogo.innerHTML = "";
  list.map((item) => {
    const itemCatalogo = document.createElement("li");
    const pratoDetalhes = document.createElement("span");
    const botaoRemover = document.createElement("button");

    botaoRemover.type = "submit";
    botaoRemover.onclick = () => onclickRemove(item);
    botaoRemover.textContent = "Remover"

    pratoDetalhes.textContent = item.prato + ".............." + "R$ " + String(item.preco) + "    ";
    
    itemCatalogo.className = "prato"

    itemCatalogo.appendChild(pratoDetalhes);
    itemCatalogo.appendChild(botaoRemover);
    catalogo.appendChild(itemCatalogo);
  });
}

function onSubmit() {
  event.preventDefault();
  const pratoElemento = document.querySelector("#prato");
  const prato = pratoElemento.value;
  const precoElemento = document.querySelector("#preco");
  const preco = precoElemento.value;
  const catalogo = getLocal();

  if (pratoElemento.value === "") return;
  if (precoElemento.value === "") return;
  if (catalogo.find((item) => item.prato === prato)){
    let atualPrato = catalogo.find((item) => item.prato === prato);
    atualPrato.preco = preco;
  } else {
    const item = { prato: prato, preco: preco };
    catalogo.push(item);
  }

  saveLocal(catalogo);
  criaLista(catalogo);

  pratoElemento.value = "";
  precoElemento.value = "";
}

window.onload = () => {
  const catalogo = getLocal();
  criaLista(catalogo);
};
