(function () {
    function cortarTexto(texto, limite) {
        if (!texto) return '';
        texto = texto.replace(/\s+/g, ' ').trim();
        if (texto.length <= limite) return texto;
        const cortado = texto.slice(0, limite + 1);
        const ultimoEspaco = cortado.lastIndexOf(' ');
        if (ultimoEspaco <= 0) return texto.slice(0, limite) + '…';
        return cortado.slice(0, ultimoEspaco) + '…';
    }

    fetch('./user/edital.html')
        .then(r => r.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const secoes = doc.querySelectorAll('main .card');
            const container = document.getElementById('cardEdital');

            if (!container) return;

            let noticiasHTML = `<h3>📢 Últimas Notícias & Editais</h3>`;

            secoes.forEach((sec, index) => {
                if (index >= 3) return; // Apenas as 3 primeiras
                const titulo = sec.querySelector('h2')?.textContent.trim() || 'Sem título';
                const texto = sec.querySelector('p')?.textContent.trim() || '';
                noticiasHTML += `
                    <div class="noticia">
                        <strong>${titulo}</strong>
                        <p>${cortarTexto(texto, 45)}</p>
                    </div>
                `;
            });

            noticiasHTML += `<button class="service-button" onclick="window.location.href='user/edital.html'">Ver mais</button>`;
            container.innerHTML = noticiasHTML;
        })
        .catch(err => {
            console.error(err);
            const container = document.getElementById('cardEdital');
            if (container) container.innerHTML = '<p>Não foi possível carregar as notícias.</p>';
        });
})();
