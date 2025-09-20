import { ref, computed } from "vue"

const STORAGE_KEY = "noticias"
const VERSION_KEY = "noticias_version"
const CURRENT_VERSION = "1.0"

// Dados iniciais com estrutura mais completa
const initialData = [
  {
    id: 1,
    titulo: "Campanha de Vacinação Gratuita",
    resumo: "Todos os pets cadastrados poderão receber vacinas gratuitamente durante nossa campanha anual de vacinação.",
    imagem: "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600",
    categoria: "vacinacao",
    status: "ativo",
    dataPublicacao: new Date('2024-08-15').toISOString(),
    autor: "Centro Veterinário Municipal",
    detalhes: {
      data: "20/08/2025 a 30/08/2025",
      horario: "08h às 17h",
      local: "Centro Veterinário Municipal - Rua das Flores, 123",
      publico: "Pets previamente cadastrados no sistema",
      contato: "(11) 99999-0000 - WhatsApp disponível",
      inscricoes: "Não é necessário agendamento",
      documentos: ["Carteira de vacinação", "Documento do tutor"]
    }
  },
  {
    id: 2,
    titulo: "Mutirão de Adoção - Encontre seu Melhor Amigo",
    resumo: "Evento especial com dezenas de cães e gatos esperando por uma família amorosa.",
    imagem: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
    categoria: "adocao",
    status: "ativo",
    dataPublicacao: new Date('2024-08-10').toISOString(),
    autor: "Secretaria de Bem-Estar Animal",
    detalhes: {
      data: "25/08/2025",
      horario: "09h às 16h",
      local: "Praça Central - Centro da Cidade",
      publico: "Famílias interessadas em adoção responsável",
      contato: "(11) 98888-0000",
      inscricoes: "Inscrições no local ou pelo site",
      documentos: ["RG", "CPF", "Comprovante de residência"]
    }
  },
  {
    id: 3,
    titulo: "Palestra: Cuidados com Pets no Inverno",
    resumo: "Aprenda como proteger seu animal de estimação durante os meses mais frios do ano.",
    imagem: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600",
    categoria: "educacao",
    status: "ativo",
    dataPublicacao: new Date('2024-08-05').toISOString(),
    autor: "Dr. Maria Silva - Veterinária",
    detalhes: {
      data: "28/08/2025",
      horario: "19h às 21h",
      local: "Auditório da Prefeitura",
      publico: "Tutores de pets e interessados",
      contato: "eventos@prefeitura.gov.br",
      inscricoes: "Gratuita - Inscrições obrigatórias",
      documentos: []
    }
  }
]

// Estado reativo
const noticias = ref([])
const carregando = ref(false)
const erro = ref(null)

// Computed properties para filtros e estatísticas
const noticiasAtivas = computed(() => 
  noticias.value.filter(n => n.status === 'ativo')
)

const noticiasPorCategoria = computed(() => {
  const categorias = {}
  noticias.value.forEach(noticia => {
    const cat = noticia.categoria || 'geral'
    if (!categorias[cat]) categorias[cat] = []
    categorias[cat].push(noticia)
  })
  return categorias
})

const estatisticas = computed(() => ({
  total: noticias.value.length,
  ativas: noticiasAtivas.value.length,
  categorias: Object.keys(noticiasPorCategoria.value).length,
  ultimaAtualizacao: noticias.value.length > 0 
    ? Math.max(...noticias.value.map(n => new Date(n.dataPublicacao).getTime()))
    : null
}))

// Funções utilitárias
function gerarId() {
  const maiorId = noticias.value.reduce((max, n) => n.id > max ? n.id : max, 0)
  return maiorId + 1
}

function validarNoticia(noticia) {
  const erros = []
  
  if (!noticia.titulo?.trim()) {
    erros.push('Título é obrigatório')
  }
  
  if (!noticia.resumo?.trim()) {
    erros.push('Resumo é obrigatório')
  }
  
  if (noticia.titulo && noticia.titulo.length > 100) {
    erros.push('Título deve ter no máximo 100 caracteres')
  }
  
  if (noticia.resumo && noticia.resumo.length > 300) {
    erros.push('Resumo deve ter no máximo 300 caracteres')
  }
  
  return erros
}

function migrarDados() {
  const versaoSalva = localStorage.getItem(VERSION_KEY)
  
  if (versaoSalva !== CURRENT_VERSION) {
    console.log('Migrando dados para nova versão...')
    
    const dadosSalvos = localStorage.getItem(STORAGE_KEY)
    if (dadosSalvos) {
      try {
        const dadosAntigos = JSON.parse(dadosSalvos)
        
        // Migração: adicionar campos faltantes
        const dadosMigrados = dadosAntigos.map(noticia => ({
          ...noticia,
          categoria: noticia.categoria || 'geral',
          status: noticia.status || 'ativo',
          dataPublicacao: noticia.dataPublicacao || new Date().toISOString(),
          autor: noticia.autor || 'Sistema',
          detalhes: {
            data: '',
            horario: '',
            local: '',
            publico: '',
            contato: '',
            inscricoes: '',
            documentos: [],
            ...noticia.detalhes
          }
        }))
        
        noticias.value = dadosMigrados
        salvarNoticias()
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
        
        console.log('Migração concluída com sucesso')
      } catch (error) {
        console.error('Erro na migração:', error)
        // Em caso de erro, usar dados iniciais
        noticias.value = [...initialData]
        salvarNoticias()
      }
    }
  }
}

// Funções principais
async function carregarNoticias() {
  carregando.value = true
  erro.value = null
  
  try {
    // Simular delay de rede (remover em produção)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    migrarDados()
    
    const salvas = localStorage.getItem(STORAGE_KEY)
    if (salvas) {
      const dadosParsed = JSON.parse(salvas)
      // Validar estrutura dos dados
      if (Array.isArray(dadosParsed)) {
        noticias.value = dadosParsed
      } else {
        throw new Error('Dados corrompidos no localStorage')
      }
    } else {
      noticias.value = [...initialData]
      salvarNoticias()
    }
    
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION)
    
  } catch (error) {
    console.error('Erro ao carregar notícias:', error)
    erro.value = 'Erro ao carregar notícias. Usando dados padrão.'
    noticias.value = [...initialData]
    salvarNoticias()
  } finally {
    carregando.value = false
  }
  
  return noticias.value
}

function salvarNoticias() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(noticias.value))
    localStorage.setItem('noticias_backup', JSON.stringify({
      data: noticias.value,
      timestamp: new Date().toISOString()
    }))
  } catch (error) {
    console.error('Erro ao salvar notícias:', error)
    throw new Error('Não foi possível salvar os dados')
  }
}

function adicionarNoticia(nova) {
  // Validação
  const errosValidacao = validarNoticia(nova)
  if (errosValidacao.length > 0) {
    throw new Error(`Erro de validação: ${errosValidacao.join(', ')}`)
  }
  
  // Preparar notícia com dados completos
  const novaNoticia = {
    id: gerarId(),
    titulo: nova.titulo.trim(),
    resumo: nova.resumo.trim(),
    imagem: nova.imagem?.trim() || '',
    categoria: nova.categoria || 'geral',
    status: nova.status || 'ativo',
    dataPublicacao: new Date().toISOString(),
    autor: nova.autor || 'Sistema',
    detalhes: {
      data: '',
      horario: '',
      local: '',
      publico: '',
      contato: '',
      inscricoes: '',
      documentos: [],
      ...nova.detalhes
    }
  }
  
  noticias.value.unshift(novaNoticia) // Adicionar no início
  salvarNoticias()
  
  return novaNoticia
}

function editarNoticia(id, dadosAtualizados) {
  const index = noticias.value.findIndex(n => n.id === id)
  if (index === -1) {
    throw new Error('Notícia não encontrada')
  }
  
  // Validação
  const errosValidacao = validarNoticia(dadosAtualizados)
  if (errosValidacao.length > 0) {
    throw new Error(`Erro de validação: ${errosValidacao.join(', ')}`)
  }
  
  // Manter dados originais importantes
  const noticiaAtualizada = {
    ...noticias.value[index],
    ...dadosAtualizados,
    id, // Garantir que o ID não mude
    dataAtualizacao: new Date().toISOString()
  }
  
  noticias.value[index] = noticiaAtualizada
  salvarNoticias()
  
  return noticiaAtualizada
}

function removerNoticiaPorId(id) {
  const index = noticias.value.findIndex(n => n.id === id)
  if (index === -1) {
    throw new Error('Notícia não encontrada')
  }
  
  const noticiaRemovida = noticias.value[index]
  noticias.value.splice(index, 1)
  salvarNoticias()
  
  return noticiaRemovida
}

function buscarNoticias(termo, filtros = {}) {
  let resultado = noticias.value
  
  // Filtro por texto
  if (termo) {
    const termoLower = termo.toLowerCase()
    resultado = resultado.filter(n => 
      n.titulo.toLowerCase().includes(termoLower) ||
      n.resumo.toLowerCase().includes(termoLower) ||
      n.autor.toLowerCase().includes(termoLower)
    )
  }
  
  // Filtro por categoria
  if (filtros.categoria) {
    resultado = resultado.filter(n => n.categoria === filtros.categoria)
  }
  
  // Filtro por status
  if (filtros.status) {
    resultado = resultado.filter(n => n.status === filtros.status)
  }
  
  // Filtro por data
  if (filtros.dataInicio) {
    resultado = resultado.filter(n => 
      new Date(n.dataPublicacao) >= new Date(filtros.dataInicio)
    )
  }
  
  if (filtros.dataFim) {
    resultado = resultado.filter(n => 
      new Date(n.dataPublicacao) <= new Date(filtros.dataFim)
    )
  }
  
  return resultado
}

function obterNoticiaPorId(id) {
  return noticias.value.find(n => n.id === id)
}

function obterCategoriasDisponiveis() {
  return [
    { value: 'vacinacao', label: 'Vacinação', icon: '💉' },
    { value: 'adocao', label: 'Adoção', icon: '🐾' },
    { value: 'educacao', label: 'Educação', icon: '📚' },
    { value: 'campanhas', label: 'Campanhas', icon: '📢' },
    { value: 'eventos', label: 'Eventos', icon: '📅' },
    { value: 'emergencia', label: 'Emergência', icon: '🚨' },
    { value: 'geral', label: 'Geral', icon: '📰' }
  ]
}

function exportarDados() {
  const dados = {
    noticias: noticias.value,
    estatisticas: estatisticas.value,
    dataExportacao: new Date().toISOString(),
    versao: CURRENT_VERSION
  }
  
  const blob = new Blob([JSON.stringify(dados, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `noticias_backup_${new Date().toISOString().split('T')[0]}.json`
  link.click()
  
  URL.revokeObjectURL(url)
}

function importarDados(arquivo) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target.result)
        
        if (dados.noticias && Array.isArray(dados.noticias)) {
          noticias.value = dados.noticias
          salvarNoticias()
          resolve(dados.noticias.length)
        } else {
          reject(new Error('Formato de arquivo inválido'))
        }
      } catch (error) {
        reject(new Error('Erro ao processar arquivo'))
      }
    }
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
    reader.readAsText(arquivo)
  })
}

// Hook principal
export function useNoticias() {
  return {
    // Estado
    noticias,
    carregando,
    erro,
    
    // Computed
    noticiasAtivas,
    noticiasPorCategoria,
    estatisticas,
    
    // Funções CRUD
    carregarNoticias,
    salvarNoticias,
    adicionarNoticia,
    editarNoticia,
    removerNoticiaPorId,
    
    // Funções de busca e filtro
    buscarNoticias,
    obterNoticiaPorId,
    
    // Funções utilitárias
    obterCategoriasDisponiveis,
    exportarDados,
    importarDados,
    
    // Validação
    validarNoticia
  }
}