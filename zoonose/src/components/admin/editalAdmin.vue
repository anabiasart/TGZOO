<script setup>
import { ref, onMounted, watch } from "vue"
import { useEditais } from "@/data/editaisData.js"
import vete from "@/assets/img/vete.jpg"

const { todosItens, carregarTodos } = useEditais()

const carregando = ref(true)
const tipoSelecionado = ref("noticia")
const editando = ref(false)

const itemAtual = ref({
  id: null,
  tipo: "noticia",
  titulo: "",
  resumo: "",
  autor: "",
  dataInicioCampanha: "",
  dataFimCampanha: "",
  horarioCampanha: "",
  urlImagem: "",
})

const imagemPreview = ref(vete)
const toastMsg = ref("")
const mostrarToast = ref(false)
const toastTipo = ref("success")

onMounted(async () => {
  try {
    await carregarTodos()
  } catch (e) {
    mostrarToastMsg("Erro ao carregar editais.", "error")
  } finally {
    carregando.value = false
  }
})

watch(() => itemAtual.value.urlImagem, (nova) => {
  imagemPreview.value = nova || vete
})

function getItensPorTipo(tipo) {
  return todosItens.value.filter(i => i.tipo === tipo)
}

function mostrarToastMsg(msg, tipo = "success") {
  toastMsg.value = msg
  toastTipo.value = tipo
  mostrarToast.value = true
  setTimeout(() => (mostrarToast.value = false), 3000)
}

async function salvarItem() {
  try {
    const tipo = tipoSelecionado.value
    const url = tipo === "campanha" ? "/campaigns" : "/news"

    const metodo = editando.value ? "PUT" : "POST"
    const corpo = { ...itemAtual.value, tipo }

    if (tipo === "campanha") {
      corpo.startDateTime = corpo.dataInicioCampanha
      corpo.endDateTime = corpo.dataFimCampanha
    }

    const resp = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(corpo)
    })

    if (!resp.ok) throw new Error(`Erro ao salvar: ${resp.status}`)

    mostrarToastMsg(editando.value ? "✅ Atualizado com sucesso!" : "✅ Cadastrado com sucesso!")
    await carregarTodos()
    resetarFormulario()
  } catch (e) {
    console.error("Erro ao salvar item:", e)
    mostrarToastMsg("❌ Erro ao salvar. Verifique os dados.", "error")
  }
}

function editarItem(item) {
  editando.value = true
  itemAtual.value = { ...item }
  imagemPreview.value = item.urlImagem || vete
  tipoSelecionado.value = item.tipo
}

async function excluirItem(item) {
  if (!confirm("Deseja realmente excluir este item?")) return
  try {
    const url = item.tipo === "campanha"
      ? `/campaigns/${item.id}`
      : `/news/${item.id}`

    const resp = await fetch(url, { method: "DELETE" })
    if (!resp.ok) throw new Error()
    mostrarToastMsg("🗑️ Excluído com sucesso!")
    await carregarTodos()
  } catch {
    mostrarToastMsg("Erro ao excluir item.", "error")
  }
}

function resetarFormulario() {
  itemAtual.value = {
    id: null,
    tipo: "noticia",
    titulo: "",
    resumo: "",
    autor: "",
    dataInicioCampanha: "",
    dataFimCampanha: "",
    horarioCampanha: "",
    urlImagem: "",
  }
  imagemPreview.value = vete
  editando.value = false
}
</script>

<template>
  <div class="admin-container">
    <h1>⚙️ Painel de Gerenciamento de Editais</h1>

    <div class="tipo-toggle">
      <button
        :class="{ ativo: tipoSelecionado === 'noticia' }"
        @click="tipoSelecionado = 'noticia'"
      >
        📰 Notícias
      </button>
      <button
        :class="{ ativo: tipoSelecionado === 'campanha' }"
        @click="tipoSelecionado = 'campanha'"
      >
        📢 Campanhas
      </button>
    </div>

    <!-- Formulário -->
    <div class="card-form">
      <h2>{{ editando ? "✏️ Editar" : "➕ Nova" }} {{ tipoSelecionado }}</h2>
      <form @submit.prevent="salvarItem">
        <label>Título:</label>
        <input v-model="itemAtual.titulo" required />

        <div v-if="tipoSelecionado === 'noticia'">
          <label>Resumo:</label>
          <textarea v-model="itemAtual.resumo" rows="3" required></textarea>

          <label>Autor:</label>
          <input v-model="itemAtual.autor" placeholder="Sistema ou Nome" />
        </div>

        <div v-else>
          <label>Data Início:</label>
          <input type="date" v-model="itemAtual.dataInicioCampanha" required />

          <label>Data Fim:</label>
          <input type="date" v-model="itemAtual.dataFimCampanha" required />

          <label>Horário:</label>
          <input v-model="itemAtual.horarioCampanha" placeholder="Ex: 08:00 até 17:00" />
        </div>

        <label>URL da Imagem:</label>
        <input v-model="itemAtual.urlImagem" placeholder="https://..." />

        <div class="preview">
          <img :src="imagemPreview" alt="Prévia" />
        </div>

        <div class="acoes-form">
          <button type="submit" class="btn-salvar">
            {{ editando ? "Salvar Alterações" : "Cadastrar" }}
          </button>
          <button type="button" class="btn-resetar" @click="resetarFormulario">
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista -->
    <div v-if="!carregando" class="lista-itens">
      <h2>📋 {{ tipoSelecionado === 'noticia' ? 'Notícias' : 'Campanhas' }} cadastradas</h2>

      <div v-for="item in getItensPorTipo(tipoSelecionado)" :key="item.id" class="item-card">
        <img :src="item.urlImagem || vete" alt="Capa" />
        <div class="info">
          <h3>{{ item.titulo }}</h3>
          <p v-if="item.tipo === 'noticia'">{{ item.resumo }}</p>
          <p v-else>
            {{ item.dataInicioCampanha }} → {{ item.dataFimCampanha }}
            <span v-if="item.horarioCampanha">• {{ item.horarioCampanha }}</span>
          </p>
        </div>
        <div class="acoes">
          <button @click="editarItem(item)" class="btn-editar">Editar</button>
          <button @click="excluirItem(item)" class="btn-excluir">Excluir</button>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="fade">
      <div v-if="mostrarToast" :class="['toast', toastTipo]">{{ toastMsg }}</div>
    </transition>
  </div>
</template>

<style scoped>
.admin-container {
  background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
  min-height: 100vh;
  padding: 2rem;
  color: #333;
}
h1 {
  text-align: center;
  color: #0ea5e9;
  margin-bottom: 1.5rem;
}
.tipo-toggle {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1.5rem;
}
.tipo-toggle button {
  background: #f1f5f9;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
}
.tipo-toggle .ativo {
  background: #0ea5e9;
  color: white;
}
.card-form {
  background: #fff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
  max-width: 700px;
  margin: 0 auto 2rem;
}
.card-form label {
  display: block;
  margin-top: 1rem;
  font-weight: 600;
}
.card-form input, textarea {
  width: 100%;
  padding: 0.6rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-top: 0.3rem;
}
.preview {
  text-align: center;
  margin-top: 1rem;
}
.preview img {
  width: 100%;
  max-height: 180px;
  object-fit: cover;
  border-radius: 10px;
}
.acoes-form {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.btn-salvar {
  background: #059669;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
}
.btn-resetar {
  background: #dc2626;
  color: white;
  border: none;
  padding: 0.7rem 1.4rem;
  border-radius: 8px;
  cursor: pointer;
}
.lista-itens {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}
.item-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  border-bottom: 1px solid #eee;
  padding: 0.8rem 0;
}
.item-card img {
  width: 90px;
  height: 60px;
  border-radius: 8px;
  object-fit: cover;
}
.item-card .info {
  flex: 1;
}
.item-card h3 {
  color: #0ea5e9;
  margin: 0;
}
.acoes {
  display: flex;
  gap: 0.5rem;
}
.btn-editar {
  background: #2563eb;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
.btn-excluir {
  background: #dc2626;
  color: #fff;
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 20px;
  right: 20px;
  background: #059669;
  color: white;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 500;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  opacity: 0.95;
}
.toast.error {
  background: #dc2626;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
