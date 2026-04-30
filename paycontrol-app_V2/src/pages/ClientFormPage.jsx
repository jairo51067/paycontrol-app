import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useClients } from '../hooks/useClients'
import ClientForm from '../components/clients/ClientForm'

export default function ClientFormPage() {
  const { isAuthenticated } = useAuth()
  const { addClient } = useClients()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  const handleSubmit = (data) => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    try {
      addClient(data)
      setMessage({ type: 'success', text: 'Cliente registrado exitosamente.' })
      setTimeout(() => {
        navigate('/dashboard')
      }, 800)
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al registrar el cliente.' })
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 sm:py-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Registrar nuevo cliente</h2>
        <p className="text-gray-600 mt-1">
          Ingrese los datos del cliente y su deuda.
        </p>
      </div>

      {message.text && (
        <div
          className={`mb-6 p-4 rounded-lg text-sm font-medium ${
            message.type === 'error'
              ? 'bg-red-50 text-danger border border-red-200'
              : 'bg-green-50 text-success border border-green-200'
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="card">
        <ClientForm onSubmit={handleSubmit} loading={loading} />
      </div>
    </div>
  )
}

