// Colocar o link do endpoit gerado pelo crudcrud nesta constante
const baseUrl = "https://crudcrud.com/api/447f3c1793d047998aad195bdaf66395";

async function getAllRemote() {
    const response = await fetch(`${baseUrl}/catalogo`);
    const data = await response.json();
    return data;
}

function saveRemote(item) {
    return fetch(`${baseUrl}/catalogo`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(item),
    });
}

function deleteRemote(item) {
    return fetch(`${baseUrl}/catalogo/${item._id}`, {
        method: "DELETE"
    });
}

function updateRemote(item) {
    return fetch(`${baseUrl}/catalogo/${item._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ prato: item.prato, preco: item.preco }),
    });
}

function criaLista(lista) {
    async function onclickRemove(item) {
        let catalogo = await getAllRemote();
        console.log(catalogo);
        let itemRemoto = catalogo.find(elemento => elemento.prato === item.prato);
        if (itemRemoto !== undefined) {
            await deleteRemote(item);
        }
        catalogo = await getAllRemote();
        criaLista(catalogo);
    }

    const catalogo = document.querySelector("ul");
    catalogo.innerHTML = "";
    lista.map((item) => {
        const itemCatalogo = document.createElement("li");
        const pratoDetalhes = document.createElement("span");
        const botaoRemover = document.createElement("button");
        botaoRemover.type = "submit";
        botaoRemover.onclick = () => onclickRemove(item);
        botaoRemover.textContent = "Remover"
        pratoDetalhes.textContent = item.prato + " .............. " + "R$ " + String(item.preco) + "    ";
        itemCatalogo.className = "prato"
        itemCatalogo.appendChild(pratoDetalhes);
        itemCatalogo.appendChild(botaoRemover);
        catalogo.appendChild(itemCatalogo);
    });
}

async function onSubmit() {
    event.preventDefault();
    const pratoElemento = document.querySelector("#prato");
    const prato = pratoElemento.value;
    const precoElemento = document.querySelector("#preco");
    const preco = precoElemento.value;
    const catalogo = await getAllRemote();

    if (pratoElemento.value === "") return;
    if (precoElemento.value === "") return;
    if (catalogo.find((item) => item.prato === prato)) {
        let itemAtualizado = catalogo.find((item) => item.prato === prato);
        itemAtualizado.preco = preco;
        await updateRemote(itemAtualizado);
    } else {
        const item = { prato: prato, preco: preco };
        await saveRemote(item);
    }

    const catalogoAtual = await getAllRemote();
    console.log(catalogoAtual)
    criaLista(catalogoAtual);

    pratoElemento.value = "";
    precoElemento.value = "";
}

window.onload = async () => {
    const catalogo = await getAllRemote();
    criaLista(catalogo);
};
