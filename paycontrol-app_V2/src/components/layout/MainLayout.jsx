import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Logo from '../common/Logo'

export default function MainLayout({ children }) {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/')
    setMenuOpen(false)
  }

  const isHome = location.pathname === '/'

  const navLinkClass =
    'block w-full text-left sm:text-center px-3 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors'

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center gap-3">
              <Logo size="sm" />
              <span className="text-xl font-bold text-gray-900">PayControl</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={navLinkClass}>
                    Dashboard
                  </Link>
                  <Link to="/clients/new" className={navLinkClass}>
                    Nuevo Cliente
                  </Link>
                  <Link to="/settings" className={navLinkClass}>
                    Respaldo
                  </Link>
                  <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                    <span className="text-sm text-gray-600">{user?.name}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm font-medium text-danger hover:text-red-700 transition-colors px-3 py-2"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                !isHome && (
                  <Link
                    to="/"
                    className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors px-3 py-2"
                  >
                    Inicio
                  </Link>
                )
              )}
            </nav>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
              aria-label="Menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-1">
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/clients/new" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    Nuevo Cliente
                  </Link>
                  <Link to="/settings" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    Respaldo
                  </Link>
                  <div className="pt-2 border-t border-gray-100 mt-2">
                    <p className="px-3 text-xs text-gray-500 mb-1">{user?.name}</p>
                    <button onClick={handleLogout} className={navLinkClass + ' text-danger'}>
                      Cerrar sesión
                    </button>
                  </div>
                </>
              ) : (
                !isHome && (
                  <Link to="/" className={navLinkClass} onClick={() => setMenuOpen(false)}>
                    Inicio
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} PayControl. Todos los derechos reservados.
        </div>
      </footer>
    </div>
  )
}

