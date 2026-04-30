import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import BackupPanel from '../components/backup/BackupPanel'
import ResetAppPanel from '../components/backup/ResetAppPanel'

export default function SettingsPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Configuración</h2>
        <p className="text-gray-600 mt-1">
          Gestione respaldos y preferencias de la aplicación.
        </p>
      </div>

      <BackupPanel />
      <ResetAppPanel />
    </div>
  )
}
