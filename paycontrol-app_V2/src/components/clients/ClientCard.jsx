import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency, formatDate } from '../../utils/helpers'

export default function ClientCard({ client, totalPaid, onDelete }) {
  const remaining = Math.max(0, Number(client.debtAmount) - Number(totalPaid))

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{client.name}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            Deuda desde: {formatDate(client.debtDate)}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            remaining <= 0
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {remaining <= 0 ? 'Pagado' : 'Pendiente'}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{client.description}</p>

      <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 text-sm">
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide">Deuda total</p>
          <p className="font-bold text-gray-900 text-sm sm:text-base">{formatCurrency(client.debtAmount)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide">Abonado</p>
          <p className="font-bold text-success text-sm sm:text-base">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 text-center">
          <p className="text-gray-500 text-[10px] sm:text-xs mb-0.5 uppercase tracking-wide">Restante</p>
          <p className={`font-bold text-sm sm:text-base ${remaining <= 0 ? 'text-success' : 'text-danger'}`}>
            {formatCurrency(remaining)}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <Link
          to={`/clients/${client.id}`}
          className="flex-1 text-center btn-primary text-sm py-2.5 rounded-lg min-h-[44px]"
        >
          Ver detalle
        </Link>
        <button
          onClick={() => onDelete(client.id)}
          className="px-4 py-2.5 text-sm font-medium text-danger bg-red-50 hover:bg-red-100 rounded-lg transition-colors min-h-[44px]"
        >
          Eliminar
        </button>
      </div>
    </div>
  )
}

