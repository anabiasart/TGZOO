
export function toBackendTimestamp(dateLike) {
  const d = new Date(dateLike)
  const pad = n => String(n).padStart(2, '0')
  const Y = d.getFullYear()
  const M = pad(d.getMonth() + 1)
  const D = pad(d.getDate())
  const h = pad(d.getHours())
  const m = pad(d.getMinutes())
  const s = pad(d.getSeconds() || 0)
  return `${Y}-${M}-${D} ${h}:${m}:${s}` }

export function parseBackendTs(ts) {
  if (!ts) return null
  const norm = ts.replace('T', ' ')
  const [date, time = '00:00:00'] = norm.split(' ')
  const [Y, M, D] = date.split('-').map(Number)
  const [h, m, s = 0] = time.split(':').map(Number)
  return new Date(Y, (M || 1) - 1, D || 1, h || 0, m || 0, s || 0)
}

export function formatDataBR(ts) {
  const d = parseBackendTs(ts)
  return d ? d.toLocaleDateString('pt-BR') : ''
}

export function formatHoraBR(ts) {
  const d = parseBackendTs(ts)
  return d ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
}
