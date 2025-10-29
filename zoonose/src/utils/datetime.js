
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
  if (!ts) return null;

  try {
    const d = new Date(ts);

    if (isNaN(d.getTime())) {
      console.warn("parseBackendTs: valor inválido recebido:", ts);
      return null;
    }

    return d;
  } catch (e) {
    console.warn("parseBackendTs erro:", ts, e);
    return null;
  }
}

export function formatDataBR(ts) {
  const d = parseBackendTs(ts)
  return d ? d.toLocaleDateString('pt-BR') : ''
}

export function formatHoraBR(ts) {
  const d = parseBackendTs(ts)
  return d ? d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''
}
