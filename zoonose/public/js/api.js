const API_URL = "http://localhost:8080"; // Trocar para a URL do seu backend Spring

// ====== SIMULAÇÃO ======
async function getAnimais() {
    return [
        { id: 1, nome: "Rex", especie: "Cachorro" },
        { id: 2, nome: "Mimi", especie: "Gato" }
    ];
}

async function getEspecies() {
    return [
        { id: 1, nome: "Cachorro" },
        { id: 2, nome: "Gato" }
    ];
}

async function getProtocolos() {
    return [
        { id: 1, nome: "Vacinação Antirrábica" },
        { id: 2, nome: "Vermifugação" }
    ];
}

async function getAtendimentos() {
    return [
        { id: 1, descricao: "Consulta Geral" },
        { id: 2, descricao: "Vacinação" }
    ];
}

//async function getAgenda() {
  //  return [
    //    { id: 1, data: "2025-08-15", evento: "Mutirão de Castração" }
    //];
//}

// ====== QUANDO O BACKEND SPRING ESTIVER PRONTO ======
// async function getAnimais() {
//     const resp = await fetch(`${API_URL}/animais`);
//     return await resp.json();
// }
