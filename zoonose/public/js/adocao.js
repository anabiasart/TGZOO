document.addEventListener("DOMContentLoaded", async () => {
    
    const animais = [
        { id: 1, nome: "Luna", especie: "Cachorro", idade: "2 anos", foto: "img/luna.jpg" },
        { id: 2, nome: "Toby", especie: "Gato", idade: "1 ano", foto: "img/toby.jpg" },
        { id: 3, nome: "Mel", especie: "Cachorro", idade: "3 anos", foto: "img/mel.jpg" }
    ];

    const container = document.getElementById("listaAdocao");
    container.innerHTML = "";

    animais.forEach(animal => {
        const card = document.createElement("div");
        card.classList.add("card");

        card.innerHTML = `
            <img src="${animal.foto}" alt="${animal.nome}">
            <h3>${animal.nome}</h3>
            <p><strong>Espécie:</strong> ${animal.especie}</p>
            <p><strong>Idade:</strong> ${animal.idade}</p>
            <a href="detalhes.html?id=${animal.id}" class="btn">Adotar</a>
        `;

        container.appendChild(card);
    });
});
