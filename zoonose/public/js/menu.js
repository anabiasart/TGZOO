document.addEventListener("DOMContentLoaded", () => {
    const menuHTML = `
        <div class="header">
            <div class="logo">
                <h1><a href="comunicativo.html">ZoonoSys</a></h1>
                <p>Vigilância, Prevenção e Controle de Zoonoses</p>
            </div>
            <nav class="nav">
                <ul>
                    <li><a href="index.html">Página Inicial</a></li>
                    <li><a href="AnimalListar.html">Animais</a></li>
                    <li><a href="EspecieListar.html">Espécies</a></li>
                    <li><a href="ProtocoloListar.html">Protocolo</a></li>
                    <li><a href="AtendimentoListar.html">Atendimento</a></li>
                    <li><a href="AgendaListar.html">Agenda</a></li>
                </ul>
            </nav>
        </div>
    `;
    document.body.insertAdjacentHTML("afterbegin", menuHTML);
});
