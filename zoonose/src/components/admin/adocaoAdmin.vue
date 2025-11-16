  <template>
    <div class="admin-dashboard">
      <!-- Cabeçalho -->
      <header class="dashboard-header">
        <div class="header-content">
          <h1>
            Gerenciar Adoções
          </h1>
          <div class="header-stats">
            <div class="stat-item">
              <span class="stat-number">{{ animais.length }}</span>
              <span class="stat-label">Total</span>
            </div>
            <div class="stat-item success">
              <span class="stat-number">{{ totalCachorros }}</span>
              <span class="stat-label">Cachorros</span>
            </div>
            <div class="stat-item info">
              <span class="stat-number">{{ totalGatos }}</span>
              <span class="stat-label">Gatos</span>
            </div>
          </div>
        </div>
      </header>

      <section class="controls-section">
        <div class="search-filters">
          <input
            v-model="filtro"
            type="text"
            placeholder=" Buscar por nome, espécie..."
            class="search-input"
          />
          <button @click="abrirModal()" class="btn-secondary btn-sm">
             Novo Animal
          </button>
        </div>
      </section>

      <div v-if="carregando" class="loading-container">
        <div class="spinner"></div>
        <p>Carregando...</p>
      </div>

      <section v-if="!carregando" class="noticias-grid">
        <div
          v-for="a in animaisFiltrados"
          :key="a.id"
          class="noticia-card"
        >
          <div class="card-header">
            <span class="badge" :class="a.species === 'CANINE' ? 'badge-cachorro' : 'badge-gato'">
              {{ traduzirEspecie(a.species) }}

            </span>
            <span class="badge-status">{{ traduzirGenero(a.gender) }}</span>
          </div>

          <div class="card-content">
            <div class="card-image">
              <img :src="a.imageUrl || placeholder" alt="foto animal" />
            </div>
            <h3 class="card-title">{{ a.name }}</h3>
            <p class="card-description">{{ truncarTexto(a.description, 120) }}</p>
          </div>

          <div class="card-footer">
            <div class="card-meta">
              <span> Porte: {{ traduzirPorte(a.size) }}</span>
              <span>{{ a.isVaccinated ? 'Vacinado' : 'Não vacinado' }}</span>
            </div>

            <div class="card-actions">
              <button class="btn-secondary btn-sm" @click="editarAnimal(a)">Editar</button>
              <button class="btn-danger btn-sm" @click="removerAnimal(a.id)">Excluir</button>
            </div>
          </div>
        </div>-

        <div v-if="animaisFiltrados.length === 0" class="empty-state">
          <div class="empty-content">
            <span class="empty-icon"></span>
            <h3>Nenhum animal encontrado</h3>
            <button @click="abrirModal()" class="btn-primary">Cadastrar Novo</button>
          </div>
        </div>
      </section>

      <teleport to="body">
        <transition name="modal">
          <div v-if="mostrarModal" class="modal-overlay" @click.self="fecharModal">
            <div class="modal-content" @click.stop>
              <div class="modal-header">
                <h2>{{ editando ? 'Editar Animal' : ' Novo Animal' }}</h2>
                <button @click="fecharModal" class="btn-close">✕</button>
              </div>

              <div class="modal-body">
                <form class="form-animal" @submit.prevent="salvarAnimal">
                  <div class="form-group">
                    <label>Nome do Animal <span>*</span></label>
                    <input v-model="form.name" required placeholder="Ex: Luna, Thor, Mel..." />
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Espécie <span>*</span></label>
                      <select v-model="form.species" required>
                        <option value="">Selecione</option>
                        <option value="CANINE"> Cachorro</option>
                        <option value="FELINE"> Gato</option>
                      </select>
                    </div>

                    <div class="form-group">
                      <label>Porte <span>*</span></label>
                      <select v-model="form.size" required>
                        <option value="">Selecione</option>
                        <option value="SMALL">Pequeno</option>
                        <option value="MEDIUM">Médio</option>
                        <option value="LARGE">Grande</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-row">
    <div class="form-group">
      <label>Gênero <span>*</span></label>
      <select v-model="form.gender" required>
        <option value="">Selecione</option>
        <option value="MALE">Macho</option>
        <option value="FEMALE">Fêmea</option>
      </select>
    </div>

    <div class="form-group">
      <label>Raça</label>
      <select v-model="form.breed">
        <option value="">Selecione</option>
        <option value="SRD">SRD / Sem Raça Definida</option>
        <optgroup label="Cães">
          <option value="Labrador">Labrador</option>
          <option value="Poodle">Poodle</option>
          <option value="Bulldog">Bulldog</option>
          <option value="Shih Tzu">Shih Tzu</option>
          <option value="Golden Retriever">Golden Retriever</option>
          <option value="Pastor Alemão">Pastor Alemão</option>
          <option value="Pinscher">Pinscher</option>
          <option value="Beagle">Beagle</option>
          <option value="Husky Siberiano">Husky Siberiano</option>
        </optgroup>
        <optgroup label="Gatos">
          <option value="Persa">Persa</option>
          <option value="Siamês">Siamês</option>
          <option value="Angorá">Angorá</option>
          <option value="Maine Coon">Maine Coon</option>
          <option value="Sphynx">Sphynx</option>
          <option value="Bengal">Bengal</option>
          <option value="British Shorthair">British Shorthair</option>
        </optgroup>
      </select>
    </div>
  </div>

                  <div class="form-group">
                    <label>Descrição</label>
                    <textarea
                      v-model="form.description"
                      rows="3"
                      placeholder="Ex: Brincalhona, dócil e se dá bem com outros animais."
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label>Imagem (URL)</label>
                    <input
                      v-model="form.imageUrl"
                      placeholder="Cole aqui o link da imagem do animal..."
                    />
                    <div v-if="form.imageUrl" class="image-preview">
                      <img :src="form.imageUrl" alt="Preview" />
                    </div>
                  </div>

                  <div class="checkbox-group">
                    <label>
                      <input type="checkbox" v-model="form.isVaccinated" />
                      Vacinado
                    </label>
                    <label>
                      <input type="checkbox" v-model="form.isNeutered" />
                      Castrado
                    </label>
                  </div>

                  <div class="modal-actions">
                    <button type="button" class="btn-secondary" @click="fecharModal">Cancelar</button>
                    <button type="submit" class="btn-secondary">
                      {{ editando ? 'Salvar Alterações' : 'Cadastrar' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </transition>
      </teleport>
    </div>
  </template>

  <script setup>
  import { ref, computed, onMounted } from 'vue'

  const carregando = ref(true)
  const animais = ref([])
  const filtro = ref('')
  const mostrarModal = ref(false)
  const editando = ref(false)
  const placeholder = '/src/assets/img/vete.jpg'

  const form = ref({
    id: null,
    name: '',
    breed: '',
    species: '',
    size: '',
    gender: '',
    description: '',
    imageUrl: '',
    isVaccinated: false,
    isNeutered: false,
  })

  function traduzirEspecie(v) {
    return v === 'CANINE' ? 'Cachorro' : v === 'FELINE' ? 'Gato' : 'Outro'
  }
  function traduzirPorte(v) {
    return v === 'SMALL' ? 'Pequeno' : v === 'MEDIUM' ? 'Médio' : 'Grande'
  }
  function traduzirGenero(v) {
    return v === 'MALE' ? 'Macho' : 'Fêmea'
  }
  function truncarTexto(txt, n) {
    return txt && txt.length > n ? txt.slice(0, n) + '...' : txt
  }

  const totalCachorros = computed(() => animais.value.filter(a => a.species === 'CANINE').length)
  const totalGatos = computed(() => animais.value.filter(a => a.species === 'FELINE').length)

  const animaisFiltrados = computed(() => {
    const termo = filtro.value.toLowerCase()
    return animais.value.filter(a =>
      !termo ||
      [a.name, a.species, a.description, a.breed].join(' ').toLowerCase().includes(termo)
    )
  })

  function getHeaders() {
    const token = localStorage.getItem('token')
    const headers = { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    if (token) headers['Authorization'] = token.startsWith('Bearer ') ? token : `Bearer ${token}`
    return headers
  }

  async function carregarAnimais() {
    try {
      carregando.value = true
      const res = await fetch('/api/animals', { headers: getHeaders() })
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
      const data = await res.json()
      animais.value = data.content || data
    } catch (err) {
      console.error('Erro ao carregar animais:', err)
    } finally {
      carregando.value = false
    }
  }

  function abrirModal(animal = null) {
    form.value = animal
      ? {  ...animal,
          isVaccinated: animal.isVaccinated ?? false,
          isNeutered: animal.isNeutered ?? false
        } 
      : { id: null, name: '', breed: '', species: '', size: '', gender: '', description: '', imageUrl: '', isVaccinated: false, isNeutered: false }
    editando.value = !!animal
    mostrarModal.value = true
  }

  function fecharModal() {
    mostrarModal.value = false
  }

  async function salvarAnimal() {
    try {
      const method = editando.value ? 'PUT' : 'POST'
      const url = editando.value ? `/api/animals/${form.value.id}` : '/api/animals/register'
      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(form.value),
      })

      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
      await carregarAnimais()
      fecharModal()
    } catch (err) {
      console.error('Erro ao salvar animal:', err)
      alert('Erro ao salvar animal.')
    }
    form.value.isVaccinated = !!form.value.isVaccinated
  form.value.isNeutered = !!form.value.isNeutered

  }

  async function removerAnimal(id) {
    if (!confirm('Tem certeza que deseja excluir este animal?')) return
    try {
      const res = await fetch(`/api/animals/${id}`, { method: 'DELETE', headers: getHeaders() })
      if (!res.ok) throw new Error(`Erro HTTP ${res.status}`)
      animais.value = animais.value.filter(a => a.id !== id)
    } catch (err) {
      console.error('Erro ao excluir animal:', err)
      alert('Erro ao excluir animal.')
    }
  }

  function editarAnimal(a) {
    abrirModal(a)
  }

  onMounted(carregarAnimais)
  </script>

  <style scoped>
  .admin-dashboard {
    min-height: 100vh;
    background: linear-gradient(135deg, #d1fae5, #a5f3fc, #93c5fd);
  font-family: 'Helvetica', -apple-system, BlinkMacSystemFont;
  }

.dashboard-header {
  background: linear-gradient(145deg, #ffffff, #e0f7fa, #bae6fd);
  padding: 2.5rem 2rem;
  border-radius: 0 0 2rem 2rem;
  box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  position: sticky;
  top: 0;
  z-index: 20;
}

  .header-content {
    max-width: 1200px;
    margin: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
  }
  .dashboard-header h1 {
    font-size: 2.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: #1e293b;
  }
  .header-stats {
    display: flex;
    gap: 1rem;
  }
  .stat-item {
    text-align: center;
    background: #f1f5f9;
    border-radius: 12px;
    padding: 1rem 1.5rem;
  }
  .stat-item.success {
    background: #dcfce7;
    color: #166534;
  }
  .stat-item.info {
    background: #dbeafe;
    color: #1e40af;
  }
  .stat-number {
    font-size: 2rem;
    font-weight: 700;
  }

  
  .controls-section {
    max-width: 1200px;
    margin: auto;
    padding: 1.5rem;
  }
  .search-filters {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }
  .search-input {
    flex: 1;
    padding: 0.9rem 1.2rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 1rem;
  }

  /* GRID */
  .noticias-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
    padding: 2rem;
    max-width: 1200px;
    margin: auto;
  }

  /* CARD */
.noticia-card {
  background: #ffffff;
  border-radius: 22px;
  overflow: hidden;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  transition: all 0.25s ease;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(5px);
}
 .noticia-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 10px 26px rgba(0,0,0,0.14);
}
  /* TAGS */
.card-header {
  position: absolute;
  top: 14px;
  left: 14px;
  right: 14px;
  display: flex;
  justify-content: space-between;
  z-index: 2;
}
 .badge {
  font-weight: 600;
  padding: 0.45rem 0.8rem;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #fff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(255,255,255,0.4);
}
 .badge-cachorro {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
}
.badge-gato {
  background: linear-gradient(135deg, #8b5cf6, #a78bfa);
}

.badge-status {
  background: rgba(255,255,255,0.85);
  color: #334155;
  border-radius: 10px;
  padding: 0.35rem 0.7rem;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid rgba(255,255,255,0.6);
  backdrop-filter: blur(6px);
}

  /* IMAGEM */
.card-image {
  width: 100%;
height: 280px;  
  overflow: hidden;
  border-radius: 20px 20px 0 0;
  background: #e2e8f0;
}
.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
  border-radius: inherit;
  transition: transform .35s ease;
}
.card-image:hover img {
  transform: scale(1.06);
}
  /* CONTEÚDO */
  .card-content {
    padding: 1rem 1.5rem 0.5rem;
    text-align: center;
    flex-grow: 1;
  }
  .card-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 0.4rem;
  }
  .card-description {
    color: #475569;
    font-size: 0.95rem;
    line-height: 1.4;
    margin-bottom: 0.5rem;
  }

  /* RODAPÉ */
  .card-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    background: #f9fafb;
  }
  .card-meta {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    font-size: 0.9rem;
    color: #64748b;
  }
  .card-meta span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  /* BOTÕES */
  .card-actions {
    display: flex;
    justify-content: center;
    gap: 0.8rem;
  }
  .btn-sm {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }
  .btn-secondary {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    color: white;
      border-radius: 8px;
    padding: 0.5rem 1rem;

  }

  .btn-primary {
    background: linear-gradient(135deg, #7cf8c4, #0c7e65);
    color: rgb(255, 253, 253);
      border-radius: 8px;
    padding: 0.5rem 1rem;

  }
  .btn-secondary:hover {
    background: #2563eb;
  }
  .btn-danger {
    background: linear-gradient(135deg, #ef4444, #f87171);
    color: white;
  }
  .btn-danger:hover {
    background: #dc2626;
  }


  /* Modal refinado */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
  }

  .modal-content {
    background: white;
    border-radius: 20px;
    width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
    animation: fadeIn 0.3s ease;
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.2rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
  }

  .modal-header h2 {
    margin: 0;
    font-size: 1.6rem;
    font-weight: 600;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }

  .btn-close {
    background: none;
    border: none;
    font-size: 1.4rem;
    color: #64748b;
    cursor: pointer;
    transition: 0.2s;
  }
  .btn-close:hover {
    color: #ef4444;
  }

  .modal-body {
    padding: 1.5rem;
  }

  .form-animal {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .form-group label {
    display: block;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.4rem;
  }

  .form-group label span {
    color: #ef4444;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    width: 100%;
    padding: 1rem 0.9rem;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 1.2rem;
    background: #f9fafb;
    transition: 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #3b82f6;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .form-row {
    display: flex;
    gap: 1rem;
  }

  .image-preview {
    margin-top: 0.6rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    overflow: hidden;
  }

  .image-preview img {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
  }

  .checkbox-group {
    display: flex;
    justify-content: space-around;
    padding-top: 0.3rem;
    border-top: 1px solid #e2e8f0;
    margin-top: 0.8rem;
    font-size: 19px;
  }

  .checkbox-group label {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    color: #374151;
    font-weight: 500;
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
  }

  /* Animação */
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
