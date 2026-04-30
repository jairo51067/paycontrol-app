import React, { useRef, useState } from 'react'
import { backupService } from '../../services/backupService'
import Button from '../common/Button'

export default function BackupPanel() {
  const fileInputRef = useRef(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [googleClientId, setGoogleClientId] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleExport = () => {
    backupService.exportToFile()
    setMessage({ type: 'success', text: 'Archivo de respaldo descargado.' })
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setMessage({ type: '', text: '' })
    const result = await backupService.importFromFile(file)
    setMessage(result)
    if (result.success) {
      fileInputRef.current.value = ''
    }
  }

  const handleGoogleDriveUpload = async () => {
    if (!googleClientId.trim()) {
      setMessage({ type: 'error', text: 'Ingrese su Client ID de Google Cloud Console.' })
      return
    }
    if (!backupService.isGoogleDriveAvailable()) {
      setMessage({
        type: 'error',
        text: 'Las librerías de Google no están cargadas. Agregue los scripts de Google Identity y GAPI al index.html.',
      })
      return
    }

    setUploading(true)
    setMessage({ type: '', text: '' })

    backupService.authenticateGoogle(
      googleClientId.trim(),
      async (token) => {
        const result = await backupService.uploadToGoogleDrive(token)
        setMessage(result)
        setUploading(false)
      },
      (err) => {
        setMessage({ type: 'error', text: 'Error de autenticación: ' + err.message })
        setUploading(false)
      }
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-bold text-gray-900 mb-2">Respaldo de datos</h3>
      <p className="text-sm text-gray-600 mb-6">
        Exporte o importe todos sus datos. Los respaldos se guardan en formato JSON.
      </p>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm font-medium ${
            message.type === 'error'
              ? 'bg-red-50 text-danger border border-red-200'
              : 'bg-green-50 text-success border border-green-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Exportar respaldo</h4>
          <p className="text-sm text-gray-500 mb-3">
            Descargue un archivo JSON con todos sus clientes y pagos.
          </p>
          <Button variant="primary" className="w-full" onClick={handleExport}>
            Descargar backup
          </Button>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <h4 className="font-semibold text-gray-900 mb-1">Importar respaldo</h4>
          <p className="text-sm text-gray-500 mb-3">
            Restaure sus datos desde un archivo JSON previamente exportado.
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json"
            className="hidden"
            onChange={handleFileChange}
          />
          <Button variant="secondary" className="w-full" onClick={handleImportClick}>
            Cargar backup
          </Button>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h4 className="font-semibold text-gray-900 mb-2">Google Drive (opcional)</h4>
        <p className="text-sm text-gray-500 mb-4">
          Para guardar respaldos directamente en Google Drive, configure un{' '}
          <strong>Client ID</strong> de OAuth 2.0 en{' '}
          <a
            href="https://console.cloud.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:underline"
          >
            Google Cloud Console
          </a>{' '}
          y active la API de Google Drive.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Tu Client ID de Google"
            value={googleClientId}
            onChange={(e) => setGoogleClientId(e.target.value)}
            className="input flex-1"
          />
          <Button
            variant="success"
            onClick={handleGoogleDriveUpload}
            disabled={uploading}
            className="sm:w-auto"
          >
            {uploading ? 'Subiendo...' : 'Subir a Drive'}
          </Button>
        </div>
      </div>
    </div>
  )
}

