/**
 * Servicio para exportar e importar respaldos de datos.
 * Los datos se guardan como archivo JSON descargable.
 */

const KEYS = ['paycontrol_admin', 'paycontrol_session', 'paycontrol_clients', 'paycontrol_payments']

export const backupService = {
  /**
   * Genera un objeto con todos los datos de la aplicación.
   * @returns {object}
   */
  gatherData() {
    const data = {}
    KEYS.forEach((key) => {
      const item = localStorage.getItem(key)
      data[key] = item ? JSON.parse(item) : null
    })
    return {
      app: 'PayControl',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      data,
    }
  },

  /**
   * Descarga un archivo JSON con todos los datos.
   */
  exportToFile() {
    const payload = this.gatherData()
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const date = new Date().toISOString().split('T')[0]
    const filename = `paycontrol-backup-${date}.json`

    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  },

  /**
   * Importa datos desde un archivo JSON.
   * @param {File} file
   * @returns {Promise<{success: boolean, message: string}>}
   */
  importFromFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const payload = JSON.parse(e.target.result)
          if (!payload.data || payload.app !== 'PayControl') {
            resolve({ success: false, message: 'El archivo no es un respaldo válido de PayControl.' })
            return
          }
          const data = payload.data
          KEYS.forEach((key) => {
            if (data[key] !== undefined && data[key] !== null) {
              localStorage.setItem(key, JSON.stringify(data[key]))
            } else {
              localStorage.removeItem(key)
            }
          })
          resolve({ success: true, message: 'Datos restaurados correctamente. Recargue la página.' })
        } catch (err) {
          resolve({ success: false, message: 'Error al leer el archivo: ' + err.message })
        }
      }
      reader.onerror = () => {
        resolve({ success: false, message: 'Error al leer el archivo.' })
      }
      reader.readAsText(file)
    })
  },

  /**
   * Prepara autenticación con Google para subir a Google Drive.
   * Requiere configurar un Client ID en Google Cloud Console.
   * @returns {boolean}
   */
  isGoogleDriveAvailable() {
    return typeof window !== 'undefined' && window.gapi && window.google
  },

  /**
   * Inicia el flujo OAuth 2.0 de Google.
   * @param {string} clientId - Tu Client ID de Google Cloud Console
   * @param {Function} onSuccess - Callback con el token
   * @param {Function} onError - Callback con el error
   */
  async authenticateGoogle(clientId, onSuccess, onError) {
    try {
      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: 'https://www.googleapis.com/auth/drive.file',
        callback: (tokenResponse) => {
          if (tokenResponse && tokenResponse.access_token) {
            onSuccess(tokenResponse.access_token)
          } else {
            onError(new Error('No se obtuvo token de acceso'))
          }
        },
      })
      client.requestAccessToken()
    } catch (err) {
      onError(err)
    }
  },

  /**
   * Sube el respaldo a Google Drive.
   * @param {string} accessToken
   * @returns {Promise<{success: boolean, message: string}>}
   */
  async uploadToGoogleDrive(accessToken) {
    try {
      const payload = this.gatherData()
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
      const date = new Date().toISOString().split('T')[0]
      const filename = `paycontrol-backup-${date}.json`

      const metadata = {
        name: filename,
        mimeType: 'application/json',
      }

      const form = new FormData()
      form.append(
        'metadata',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      )
      form.append('file', blob)

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: new Headers({ Authorization: 'Bearer ' + accessToken }),
          body: form,
        }
      )

      if (response.ok) {
        const result = await response.json()
        return {
          success: true,
          message: `Respaldo guardado en Google Drive. ID: ${result.id}`,
        }
      } else {
        const error = await response.json()
        return {
          success: false,
          message: 'Error de Google Drive: ' + (error.error?.message || 'Desconocido'),
        }
      }
    } catch (err) {
      return { success: false, message: 'Error al subir: ' + err.message }
    }
  },
}

