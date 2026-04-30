import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { backupService } from '../../services/backupService'
import Input from '../common/Input'
import Button from '../common/Button'

export default function ResetAppPanel() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(0)
  const [password, setPassword] = useState('')
  const [confirmText, setConfirmText] = useState('')
  const [backupDownloaded, setBackupDownloaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  const EXPECTED_CONFIRM = 'ELIMINAR'

  const handleStartReset = () => {
    setMessage({ type: '', text: '' })
    setStep(1)
  }

  const handleDownloadBackup = () => {
    backupService.exportToFile()
    setBackupDownloaded(true)
    setMessage({
      type: 'success',
      text: 'Respaldo descargado. Guarde este archivo en un lugar seguro.',
    })
  }

  const handleVerifyPassword = (e) => {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    if (!password.trim()) {
      setMessage({ type: 'error', text: 'Ingrese su contrasena.' })
      return
    }
    setStep(3)
  }

  const handleFinalReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    if (confirmText.trim() !== EXPECTED_CONFIRM) {
      setMessage({
        type: 'error',
        text: 'Debe escribir exactamente ' + EXPECTED_CONFIRM,
      })
      setLoading(false)
      return
    }

    try {
      const { authService } = await import('../../services/authService')
      const result = authService.resetApp(password.trim())
      if (result.success) {
        logout()
        setMessage({ type: 'success', text: result.message })
        setTimeout(() => {
          navigate('/')
          window.location.reload()
        }, 1500)
      } else {
        setMessage({ type: 'error', text: result.message })
        setLoading(false)
      }
    } catch (err) {
      setMessage({ type: 'error', text: 'Error inesperado.' })
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setStep(0)
    setPassword('')
    setConfirmText('')
    setBackupDownloaded(false)
    setMessage({ type: '', text: '' })
  }

  const msgClass = message.type === 'error'
    ? 'mb-4 p-3 rounded-lg text-sm font-medium bg-red-100 text-danger border border-red-200'
    : 'mb-4 p-3 rounded-lg text-sm font-medium bg-green-100 text-success border border-green-200'

  return (
    <div className="card border-red-200 bg-red-50/30 mt-8">
      <h3 className="text-lg font-bold text-red-800 mb-2 flex items-center gap-2">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        Zona de peligro
      </h3>
      <p className="text-sm text-gray-600 mb-4">
        Esta accion eliminara permanentemente todos los clientes, pagos y la cuenta de administrador.
      </p>

      {message.text && (
        <div className={msgClass}>
          {message.text}
        </div>
      )}

      {step === 0 && (
        <Button variant="danger" className="w-full" onClick={handleStartReset}>
          Quiero restablecer todo desde cero
        </Button>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg p-4 border border-yellow-300">
            <p className="text-sm font-semibold text-yellow-800 mb-2">
              Paso obligatorio: Guarde un respaldo
            </p>
            <p className="text-sm text-gray-600 mb-3">
              Antes de continuar, descargue un archivo de respaldo. Sin el, perdera todos sus datos.
            </p>
            <Button variant="primary" className="w-full" onClick={handleDownloadBackup}>
              {backupDownloaded ? 'Descargar respaldo nuevamente' : 'Descargar respaldo ahora'}
            </Button>
          </div>

          <div className="flex items-start gap-3">
            <input
              id="backup-check"
              type="checkbox"
              checked={backupDownloaded}
              onChange={(e) => setBackupDownloaded(e.target.checked)}
              className="mt-1 w-5 h-5 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="backup-check" className="text-sm text-gray-700">
              Confirmo que he descargado y guardado el archivo de respaldo.
            </label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              variant="danger"
              className="flex-1"
              disabled={!backupDownloaded}
              onClick={() => setStep(2)}
            >
              Continuar
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleVerifyPassword} className="space-y-4">
          <p className="text-sm text-gray-700">
            Ingrese su contrasena de administrador.
          </p>
          <Input
            id="reset-password"
            name="password"
            type="password"
            label="Contrasena del administrador"
            placeholder="******"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" variant="danger" className="flex-1">
              Verificar y continuar
            </Button>
            <Button variant="secondary" className="flex-1" onClick={handleCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handleFinalReset} className="space-y-4">
          <div className="bg-red-100 border border-red-300 rounded-lg p-4">
            <p className="text-sm font-bold text-red-800 mb-2">
              Ultimo paso
            </p>
            <p className="text-sm text-red-700 mb-3">
              Esta accion es irreversible. Todos sus datos seran eliminados.
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Para confirmar, escriba <strong className="font-mono text-red-800 bg-white px-1 rounded">{EXPECTED_CONFIRM}</strong>:
            </p>
            <input
              id="confirm-text"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={'Escriba ' + EXPECTED_CONFIRM}
              className="input w-full"
              autoComplete="off"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              variant="danger"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Eliminando datos...' : 'Eliminar todo permanentemente'}
            </Button>
            <Button
              variant="secondary"
              className="flex-1"
              onClick={handleCancel}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </form>
      )}
    </div>
  )
}