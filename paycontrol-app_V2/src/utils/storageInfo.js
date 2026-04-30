/**
 * Utilidades para consultar el estado del almacenamiento LocalStorage.
 */

const APP_KEYS = ['paycontrol_admin', 'paycontrol_session', 'paycontrol_clients', 'paycontrol_payments']

/**
 * Calcula el tamaño en bytes de una cadena.
 */
function getByteSize(str) {
  return new Blob([str]).size
}

/**
 * Obtiene información del uso de LocalStorage de la app.
 * @returns {{usedBytes: number, usedKB: number, usedMB: number, itemCount: number, clientCount: number, paymentCount: number}}
 */
export function getStorageUsage() {
  let usedBytes = 0
  let clientCount = 0
  let paymentCount = 0

  APP_KEYS.forEach((key) => {
    const value = localStorage.getItem(key)
    if (value) {
      usedBytes += getByteSize(value)
      if (key === 'paycontrol_clients') {
        try {
          clientCount = JSON.parse(value).length
        } catch {}
      }
      if (key === 'paycontrol_payments') {
        try {
          paymentCount = JSON.parse(value).length
        } catch {}
      }
    }
  })

  return {
    usedBytes,
    usedKB: parseFloat((usedBytes / 1024).toFixed(2)),
    usedMB: parseFloat((usedBytes / (1024 * 1024)).toFixed(2)),
    itemCount: clientCount + paymentCount,
    clientCount,
    paymentCount,
  }
}

/**
 * Estima la capacidad máxima de LocalStorage en el navegador actual.
 * @returns {Promise<{quota: number, usage: number, remaining: number}>}
 */
export async function estimateStorageQuota() {
  if (navigator.storage && navigator.storage.estimate) {
    const estimate = await navigator.storage.estimate()
    return {
      quota: estimate.quota || 0,
      usage: estimate.usage || 0,
      remaining: (estimate.quota || 0) - (estimate.usage || 0),
    }
  }
  // Fallback aproximado: la mayoría de navegadores permiten ~5 MB por origen
  return {
    quota: 5 * 1024 * 1024,
    usage: getStorageUsage().usedBytes,
    remaining: 5 * 1024 * 1024 - getStorageUsage().usedBytes,
  }
}

/**
 * Formatea bytes a unidades legibles.
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

