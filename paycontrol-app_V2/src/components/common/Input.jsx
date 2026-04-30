import React, { forwardRef } from 'react'

const Input = forwardRef(function Input(
  { label, id, error, className = '', ...props },
  ref
) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="label">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        className={`input ${error ? 'border-danger focus:ring-danger' : ''}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-danger">{error}</p>}
    </div>
  )
})

export default Input

