import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useClients } from '../hooks/useClients'
import { formatCurrency, formatDate } from '../utils/helpers'
import PaymentForm from '../components/payment/PaymentForm'

export default function ClientDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { getClient, getPayments, getTotalPaid, addPayment, removeClient } = useClients()

  const [client, setClient] = useState(null)
  const [payments, setPayments] = useState([])
  const [totalPaid, setTotalPaid] = useState(0)
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
      return
    }
    const c = getClient(id)
    if (!c) {
      navigate('/dashboard')
      return
    }
    setClient(c)
    refreshPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAuthenticated])

  const refreshPayments = () => {
    setPayments(getPayments(id))
    setTotalPaid(getTotalPaid(id))
  }

  if (!client) return null

  const remaining = Math.max(0, Number(client.debtAmount) - totalPaid)

  const handleAddPayment = (data) => {
    setLoadingPayment(true)
    setMessage({ type: '', text: '' })
    try {
      addPayment({ clientId: id, amount: data.amount, note: data.note })
      refreshPayments()
      setMessage({ type: 'success', text: 'Abono registrado correctamente.' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Error al registrar el abono.' })
    } finally {
      setLoadingPayment(false)
    }
  }

  const handleDeleteClient = () => {
    if (window.confirm('¿Está seguro de que desea eliminar este cliente y todo su historial?')) {
      removeClient(id)
      navigate('/dashboard')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-sm text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Volver al listado
        </Link>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{client.name}</h2>
        <button
          onClick={handleDeleteClient}
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-danger bg-red-50 hover:bg-red-100 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Eliminar cliente
        </button>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info del cliente */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Información del cliente</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Nombre</p>
                <p className="font-semibold text-gray-900">{client.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Fecha de inicio de deuda</p>
                <p className="font-semibold text-gray-900">{formatDate(client.debtDate)}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-sm text-gray-500">Descripción de la compra</p>
                <p className="font-semibold text-gray-900">{client.description}</p>
              </div>
            </div>
          </div>

          {/* Resumen financiero */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Resumen financiero</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-primary-50 rounded-xl p-4 text-center">
                <p className="text-xs text-primary-700 uppercase tracking-wide font-semibold">
                  Deuda total
                </p>
                <p className="text-2xl font-extrabold text-primary-900 mt-1">
                  {formatCurrency(client.debtAmount)}
                </p>
              </div>
              <div className="bg-emerald-50 rounded-xl p-4 text-center">
                <p className="text-xs text-emerald-700 uppercase tracking-wide font-semibold">
                  Total abonado
                </p>
                <p className="text-2xl font-extrabold text-emerald-900 mt-1">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div className="bg-red-50 rounded-xl p-4 text-center">
                <p className="text-xs text-red-700 uppercase tracking-wide font-semibold">
                  Monto restante
                </p>
                <p className="text-2xl font-extrabold text-red-900 mt-1">
                  {formatCurrency(remaining)}
                </p>
              </div>
            </div>
          </div>

          {/* Historial de pagos */}
          <div className="card">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Historial de abonos</h3>
            {payments.length === 0 ? (
              <p className="text-gray-500 text-sm">No se han registrado abonos aún.</p>
            ) : (
              <>
                {/* Vista de tabla en desktop */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Fecha</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700">Nota</th>
                        <th className="text-right py-2 px-3 font-semibold text-gray-700">Monto</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-2 px-3 text-gray-600">{formatDate(p.date)}</td>
                          <td className="py-2 px-3 text-gray-600">{p.note || '-'}</td>
                          <td className="py-2 px-3 text-right font-semibold text-success">
                            {formatCurrency(p.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Vista de tarjetas en móvil */}
                <div className="sm:hidden space-y-3">
                  {payments.map((p) => (
                    <div key={p.id} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{formatCurrency(p.amount)}</p>
                        <p className="text-xs text-gray-500">{formatDate(p.date)}</p>
                        {p.note && <p className="text-xs text-gray-600 mt-0.5">{p.note}</p>}
                      </div>
                      <span className="text-xs font-medium text-success bg-green-100 px-2 py-1 rounded-full">Abono</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Formulario de abono */}
        <div className="lg:col-span-1">
          <div className="card lg:sticky lg:top-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Registrar abono</h3>
            {remaining > 0 ? (
              <PaymentForm
                onSubmit={handleAddPayment}
                maxAmount={remaining}
                loading={loadingPayment}
              />
            ) : (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-green-100 text-success rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-success font-semibold">Deuda saldada</p>
                <p className="text-sm text-gray-500 mt-1">Este cliente no tiene deudas pendientes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

