import { useState, useCallback } from 'react'
import { clientService, paymentService } from '../services/clientService'

export function useClients() {
  const [clients, setClients] = useState(() => clientService.getAll())

  const refresh = useCallback(() => {
    setClients(clientService.getAll())
  }, [])

  const addClient = useCallback((data) => {
    const newClient = clientService.create(data)
    setClients((prev) => [...prev, newClient])
    return newClient
  }, [])

  const updateClient = useCallback((id, data) => {
    const updated = clientService.update(id, data)
    if (updated) {
      setClients((prev) => prev.map((c) => (c.id === id ? updated : c)))
    }
    return updated
  }, [])

  const removeClient = useCallback((id) => {
    clientService.delete(id)
    setClients((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const getClient = useCallback((id) => {
    return clientService.getById(id)
  }, [])

  const getPayments = useCallback((clientId) => {
    return paymentService.getByClient(clientId)
  }, [])

  const getTotalPaid = useCallback((clientId) => {
    return paymentService.getTotalPaid(clientId)
  }, [])

  const addPayment = useCallback((data) => {
    const payment = paymentService.create(data)
    return payment
  }, [])

  return {
    clients,
    refresh,
    addClient,
    updateClient,
    removeClient,
    getClient,
    getPayments,
    getTotalPaid,
    addPayment,
  }
}

