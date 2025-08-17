document.addEventListener("DOMContentLoaded", async () => {
    const lista = await getEspecies();
    const ul = document.getElementById("listaEspecies");

    lista.forEach(e => {
        const li = document.createElement("li");
        li.textContent = e.nome;
        ul.appendChild(li);
    });
});
