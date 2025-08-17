document.addEventListener("DOMContentLoaded", async () => {
    const lista = await getAgenda();
    const ul = document.getElementById("listaAgenda");

    lista.forEach(e => {
        const li = document.createElement("li");
        li.textContent = `${e.data} - ${e.evento}`;
        ul.appendChild(li);
    });
});
