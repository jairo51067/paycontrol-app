import React, { useState } from 'react'
import Input from '../common/Input'
import Button from '../common/Button'

export default function RegisterForm({ onSubmit, loading = false }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio'
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio'
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Ingrese un correo válido'
    }
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
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
        email: formData.email,
        password: formData.password,
      })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="reg-name"
        name="name"
        label="Nombre completo"
        placeholder="Tu nombre"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
      />
      <Input
        id="reg-email"
        name="email"
        type="email"
        label="Correo electrónico"
        placeholder="admin@ejemplo.com"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
      />
      <Input
        id="reg-password"
        name="password"
        type="password"
        label="Contraseña"
        placeholder="••••••"
        value={formData.password}
        onChange={handleChange}
        error={errors.password}
      />
      <Input
        id="reg-confirm"
        name="confirmPassword"
        type="password"
        label="Confirmar contraseña"
        placeholder="••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        error={errors.confirmPassword}
      />
      <Button type="submit" variant="primary" className="w-full" disabled={loading}>
        {loading ? 'Registrando...' : 'Crear cuenta'}
      </Button>
    </form>
  )
}

