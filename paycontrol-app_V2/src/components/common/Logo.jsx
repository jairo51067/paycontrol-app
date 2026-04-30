import React from 'react'

export default function Logo({ size = 'md', className = '' }) {
  const sizeClasses = {
    sm: 'w-10 h-10 text-xl',
    md: 'w-16 h-16 text-3xl',
    lg: 'w-24 h-24 text-5xl',
  }

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-2xl bg-primary-600 text-white flex items-center justify-center font-bold shadow-lg`}
      >
        P
      </div>
    </div>
  )
}

