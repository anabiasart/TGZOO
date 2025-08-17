document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");

    // Lista simulada (vai ser substituída pela API depois)
    const animais = [
        { id: 1, nome: "Luna", especie: "Cachorro", idade: "2 anos", foto: "img/luna.jpg", descricao: "Muito brincalhona e carinhosa." },
        { id: 2, nome: "Toby", especie: "Gato", idade: "1 ano", foto: "img/toby.jpg", descricao: "Adora dormir no sol." },
        { id: 3, nome: "Mel", especie: "Cachorro", idade: "3 anos", foto: "img/mel.jpg", descricao: "Calma e companheira." }
    ];

    let animal;

    if (!id) {
        // Caso não tenha ID, usa um animal "padrão" para teste
        animal = { id: 0, nome: "Exemplo", especie: "Cachorro", idade: "Desconhecida", foto: "img/default.jpg", descricao: "Este é um animal exemplo, usado apenas para teste." };
    } else {
        animal = animais.find(a => a.id == id);
    }

    const container = document.getElementById("detalhesAnimal");
    container.innerHTML = "";

    if (!animal) {
        container.innerHTML = `<p style="color:red; font-weight:bold;">Animal não encontrado.</p>`;
    } else {
        container.innerHTML = `
            <img src="${animal.foto}" alt="${animal.nome}" style="max-width:300px; border-radius:8px;">
            <h2>${animal.nome}</h2>
            <p><strong>Espécie:</strong> ${animal.especie}</p>
            <p><strong>Idade:</strong> ${animal.idade}</p>
            <p>${animal.descricao}</p>
            <button onclick="alert('Solicitação de adoção enviada!')">Quero Adotar</button>
        `;
    }
});
