import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useClients } from '../hooks/useClients'
import ClientList from '../components/clients/ClientList'
import { getStorageUsage, formatBytes } from '../utils/storageInfo'

export default function DashboardPage() {
  const { isAuthenticated } = useAuth()
  const { clients, getTotalPaid, removeClient } = useClients()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [storageInfo, setStorageInfo] = useState({ usedBytes: 0, usedKB: 0, usedMB: 0, clientCount: 0, paymentCount: 0 })

  useEffect(() => {
    setStorageInfo(getStorageUsage())
  }, [clients])

  if (!isAuthenticated) {
    navigate('/')
    return null
  }

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = (id) => {
    if (deleteConfirm === id) {
      removeClient(id)
      setDeleteConfirm(null)
    } else {
      setDeleteConfirm(id)
      setTimeout(() => setDeleteConfirm(null), 3000)
    }
  }

  const totalDebt = clients.reduce((sum, c) => sum + Number(c.debtAmount), 0)
  const totalPaid = clients.reduce((sum, c) => sum + getTotalPaid(c.id), 0)
  const totalRemaining = totalDebt - totalPaid

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600 mt-1">
            Gestione las deudas y pagos de sus clientes.
          </p>
        </div>
        <Link
          to="/clients/new"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo cliente
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="card bg-primary-50 border-primary-100">
          <p className="text-sm text-primary-700 font-medium">Deuda total</p>
          <p className="text-2xl font-bold text-primary-900 mt-1">
${totalDebt.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card bg-emerald-50 border-emerald-100">
          <p className="text-sm text-emerald-700 font-medium">Total abonado</p>
          <p className="text-2xl font-bold text-emerald-900 mt-1">
${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="card bg-red-50 border-red-100">
          <p className="text-sm text-red-700 font-medium">Restante por cobrar</p>
          <p className="text-2xl font-bold text-red-900 mt-1">
${totalRemaining.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      {/* List */}
      <ClientList
        clients={filteredClients}
        getTotalPaid={getTotalPaid}
        onDelete={handleDelete}
      />

      {/* Info de almacenamiento */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-600">
        <p className="font-medium text-gray-800 mb-2">Capacidad de almacenamiento</p>
        <div className="flex flex-col sm:flex-row sm:flex-wrap gap-1 sm:gap-x-4">
          <p>Clientes: <strong>{storageInfo.clientCount}</strong></p>
          <p>Pagos: <strong>{storageInfo.paymentCount}</strong></p>
          <p>Espacio usado: <strong>{formatBytes(storageInfo.usedBytes)}</strong></p>
        </div>
        <p className="mt-2 text-xs text-gray-500">
          Usa LocalStorage del navegador (5-10 MB típicos). Suficiente para miles de clientes.
        </p>
      </div>

      {deleteConfirm && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg text-sm">
          Presione eliminar nuevamente para confirmar
        </div>
      )}
    </div>
  )
}

