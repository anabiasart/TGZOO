-------------------*****-------------------------

Como esta configurado localmente - pode clonar direto do git

git clone https://github.com/seu-usuario/seu-projeto.git
cd seu-projeto

precisar instalar o node.js
npm install - Isso vai instalar todas as dependências necessárias (Vue, Vite, Tailwind etc.).

npm run dev - para:
VITE v7.1.2  ready in 1082 ms

  ➜  Local:   http://......porta..../
  ➜  Network: use --host to expose
  ➜  press h + enter to show help

se aparecer desta forma é só copiar o caminho e colar no navegador 

Este projeto usa o Vue Router para navegação entre páginas. (por conta que no js
é até possível configurar uma function para "linkar" as telas, todavia como eu to trabalhando com o vue o router é muito mais eficiente em termos de carregar em um unico html e os componentes do mesmo)

npm install vue-router@4
