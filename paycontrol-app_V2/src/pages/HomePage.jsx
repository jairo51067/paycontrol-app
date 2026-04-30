import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import Logo from '../components/common/Logo'
import LoginForm from '../components/auth/LoginForm'
import RegisterForm from '../components/auth/RegisterForm'

export default function HomePage() {
  const { isAuthenticated, hasAdmin, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState(hasAdmin ? 'login' : 'register')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  if (isAuthenticated) {
    navigate('/dashboard')
    return null
  }

  const handleLogin = async (credentials) => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    const result = login(credentials)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  const handleRegister = async (data) => {
    setLoading(true)
    setMessage({ type: '', text: '' })
    const result = register(data)
    setLoading(false)
    if (result.success) {
      navigate('/dashboard')
    } else {
      setMessage({ type: 'error', text: result.message })
    }
  }

  return (
    <div className="min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <Logo size="lg" className="mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            PayControl
          </h1>
          <p className="mt-2 text-gray-600">
            Sistema de gestión de pagos y deudas de clientes
          </p>
        </div>

        {/* Formulario */}
        <div className="card p-4 sm:p-6">
          <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
            {!hasAdmin && (
              <button
                onClick={() => setMode('register')}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === 'register'
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Registro
              </button>
            )}
            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'login'
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Iniciar sesión
            </button>
          </div>

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

          {mode === 'register' && !hasAdmin ? (
            <RegisterForm onSubmit={handleRegister} loading={loading} />
          ) : (
            <LoginForm onSubmit={handleLogin} loading={loading} />
          )}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          {hasAdmin
            ? 'Solo el administrador registrado puede acceder.'
            : 'Registre la cuenta de administrador para comenzar.'}
        </p>
      </div>
    </div>
  )
}

