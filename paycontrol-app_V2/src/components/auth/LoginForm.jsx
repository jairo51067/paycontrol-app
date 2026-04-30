import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function LoginForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.email.trim()) newErrors.email = 'El correo es obligatorio'
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria'
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
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="login-email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="admin@ejemplo.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        id="login-password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </Button>
    </form>
  )
}

