import { generateId } from '../utils/helpers'

const CLIENTS_KEY = 'paycontrol_clients'
const PAYMENTS_KEY = 'paycontrol_payments'

const getItems = (key) => {
  const data = localStorage.getItem(key)
  return data ? JSON.parse(data) : []
}

const setItems = (key, items) => {
  localStorage.setItem(key, JSON.stringify(items))
}

export const clientService = {
  /**
   * Obtiene todos los clientes.
   * @returns {Array}
   */
  getAll() {
    return getItems(CLIENTS_KEY)
  },

  /**
   * Obtiene un cliente por ID.
   * @param {string} id
   * @returns {object|null}
   */
  getById(id) {
    const clients = getItems(CLIENTS_KEY)
    return clients.find((c) => c.id === id) || null
  },

  /**
   * Crea un nuevo cliente.
   * @param {{name: string, debtDate: string, description: string, debtAmount: number}} data
   * @returns {object}
   */
  create(data) {
    const clients = getItems(CLIENTS_KEY)
    const newClient = {
      id: generateId(),
      name: data.name.trim(),
      debtDate: data.debtDate,
      description: data.description.trim(),
      debtAmount: Number(data.debtAmount),
      createdAt: new Date().toISOString(),
    }
    clients.push(newClient)
    setItems(CLIENTS_KEY, clients)
    return newClient
  },

  /**
   * Actualiza un cliente existente.
   * @param {string} id
   * @param {object} updates
   * @returns {object|null}
   */
  update(id, updates) {
    const clients = getItems(CLIENTS_KEY)
    const index = clients.findIndex((c) => c.id === id)
    if (index === -1) return null
    clients[index] = { ...clients[index], ...updates }
    setItems(CLIENTS_KEY, clients)
    return clients[index]
  },

  /**
   * Elimina un cliente y sus pagos.
   * @param {string} id
   * @returns {boolean}
   */
  delete(id) {
    let clients = getItems(CLIENTS_KEY)
    clients = clients.filter((c) => c.id !== id)
    setItems(CLIENTS_KEY, clients)

    let payments = getItems(PAYMENTS_KEY)
    payments = payments.filter((p) => p.clientId !== id)
    setItems(PAYMENTS_KEY, payments)
    return true
  },
}

export const paymentService = {
  /**
   * Obtiene todos los pagos de un cliente.
   * @param {string} clientId
   * @returns {Array}
   */
  getByClient(clientId) {
    const payments = getItems(PAYMENTS_KEY)
    return payments.filter((p) => p.clientId === clientId)
  },

  /**
   * Obtiene el total abonado por un cliente.
   * @param {string} clientId
   * @returns {number}
   */
  getTotalPaid(clientId) {
    const payments = this.getByClient(clientId)
    return payments.reduce((sum, p) => sum + Number(p.amount), 0)
  },

  /**
   * Registra un nuevo abono.
   * @param {{clientId: string, amount: number, note?: string}} data
   * @returns {object}
   */
  create(data) {
    const payments = getItems(PAYMENTS_KEY)
    const newPayment = {
      id: generateId(),
      clientId: data.clientId,
      amount: Number(data.amount),
      note: data.note ? data.note.trim() : '',
      date: new Date().toISOString(),
    }
    payments.push(newPayment)
    setItems(PAYMENTS_KEY, payments)
    return newPayment
  },

  /**
   * Elimina un pago.
   * @param {string} paymentId
   * @returns {boolean}
   */
  delete(paymentId) {
    let payments = getItems(PAYMENTS_KEY)
    payments = payments.filter((p) => p.id !== paymentId)
    setItems(PAYMENTS_KEY, payments)
    return true
  },
}

