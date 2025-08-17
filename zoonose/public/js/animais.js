document.addEventListener("DOMContentLoaded", async () => {
    const lista = await getAnimais();
    const ul = document.getElementById("listaAnimais");

    lista.forEach(a => {
        const li = document.createElement("li");
        li.textContent = `${a.nome} - ${a.especie}`;
        ul.appendChild(li);
    });
});
