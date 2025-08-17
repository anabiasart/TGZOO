document.addEventListener("DOMContentLoaded", async () => {
    const lista = await getProtocolos();
    const ul = document.getElementById("listaProtocolos");

    lista.forEach(p => {
        const li = document.createElement("li");
        li.textContent = p.nome;
        ul.appendChild(li);
    });
});
