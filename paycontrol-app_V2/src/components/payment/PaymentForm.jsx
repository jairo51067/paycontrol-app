import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function PaymentForm({ onSubmit, maxAmount, loading = false }) {
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const val = Number(amount)
    if (!amount || val <= 0) {
      setError('Ingrese un monto válido mayor a 0')
      return
    }
    if (val > maxAmount) {
      setError(`El abono no puede exceder el monto restante (${maxAmount.toFixed(2)})`)
      return
    }

    onSubmit({ amount: val, note })
    setAmount('')
    setNote('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="payment-amount"
        name="amount"
        type="number"
        step="0.01"
        min="0.01"
        label="Monto a abonar"
        placeholder="0.00"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        error={error}
      />
      <div>
        <label htmlFor="payment-note" className="label">
          Nota (opcional)
        </label>
        <textarea
          id="payment-note"
          name="note"
          rows={2}
          placeholder="Ej. Pago parcial en efectivo"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="input resize-none"
        />
      </div>
      <Button type="submit" variant="success" className="w-full" disabled={loading}>
        {loading ? 'Registrando...' : 'Registrar abono'}
      </Button>
    </form>
  )
}

