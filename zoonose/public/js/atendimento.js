document.addEventListener("DOMContentLoaded", async () => {
    const lista = await getAtendimentos();
    const ul = document.getElementById("listaAtendimentos");

    lista.forEach(a => {
        const li = document.createElement("li");
        li.textContent = a.descricao;
        ul.appendChild(li);
    });
});
