import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function ClientForm({ onSubmit, loading = false }) {
  const today = new Date().toISOString().split('T')[0]

  const [formData, setFormData] = useState({
    name: '',
    debtDate: today,
    description: '',
    debtAmount: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre del cliente es obligatorio'
    if (!formData.debtDate) newErrors.debtDate = 'La fecha de inicio es obligatoria'
    if (!formData.description.trim()) newErrors.description = 'La descripción es obligatoria'
    if (!formData.debtAmount || Number(formData.debtAmount) <= 0) {
      newErrors.debtAmount = 'Ingrese un monto válido mayor a 0'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      onSubmit({
        name: formData.name,
        debtDate: formData.debtDate,
        description: formData.description,
        debtAmount: Number(formData.debtAmount),
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input
        id="client-name"
        name="name"
        label="Nombre del cliente"
        placeholder="Ej. Juan Pérez"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />

      <div>
        <label htmlFor="client-debtDate" className="label">
          Fecha de inicio de la deuda
        </label>
        <input
          id="client-debtDate"
          name="debtDate"
          type="date"
          value={formData.debtDate}
          onChange={handleChange}
          className={`input ${errors.debtDate ? 'border-danger focus:ring-danger' : ''}`}
        />
        {errors.debtDate && <p className="mt-1 text-sm text-danger">{errors.debtDate}</p>}
      </div>

      <div>
        <label htmlFor="client-description" className="label">
          Descripción de la compra
        </label>
        <textarea
          id="client-description"
          name="description"
          rows={3}
          placeholder="¿Qué compró el cliente?"
          value={formData.description}
          onChange={handleChange}
          className={`input resize-none ${errors.description ? 'border-danger focus:ring-danger' : ''}`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-danger">{errors.description}</p>
        )}
      </div>

      <Input
        id="client-debtAmount"
        name="debtAmount"
        type="number"
        step="0.01"
        min="0"
        label="Monto de la deuda"
        placeholder="0.00"
        value={formData.debtAmount}
        onChange={handleChange}
        error={errors.debtAmount}
      />

      <div className="pt-2 flex gap-3">
        <Button type="submit" variant="primary" className="flex-1" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cliente'}
        </Button>
      </div>
    </form>
  )
}

