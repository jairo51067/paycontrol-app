const ADMIN_KEY = 'paycontrol_admin'

export const authService = {
  /**
   * Registra el administrador único.
   * @param {{name: string, email: string, password: string}} data
   * @returns {{success: boolean, message: string}}
   */
  register(data) {
    const existing = localStorage.getItem(ADMIN_KEY)
    if (existing) {
      return { success: false, message: 'Ya existe un administrador registrado.' }
    }
    const admin = {
      id: 'admin-' + Date.now(),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      password: data.password, // En producción usar hash
      createdAt: new Date().toISOString(),
    }
    localStorage.setItem(ADMIN_KEY, JSON.stringify(admin))
    return { success: true, message: 'Administrador registrado exitosamente.' }
  },

  /**
   * Inicia sesión del administrador.
   * @param {{email: string, password: string}} credentials
   * @returns {{success: boolean, message: string, user?: object}}
   */
  login(credentials) {
    const stored = localStorage.getItem(ADMIN_KEY)
    if (!stored) {
      return { success: false, message: 'No hay administrador registrado.' }
    }
    const admin = JSON.parse(stored)
    if (
      admin.email === credentials.email.trim().toLowerCase() &&
      admin.password === credentials.password
    ) {
      const session = { id: admin.id, name: admin.name, email: admin.email }
      localStorage.setItem('paycontrol_session', JSON.stringify(session))
      return { success: true, message: 'Sesión iniciada.', user: session }
    }
    return { success: false, message: 'Credenciales incorrectas.' }
  },

  /**
   * Verifica la contraseña del administrador sin iniciar sesión.
   * @param {string} password
   * @returns {boolean}
   */
  verifyPassword(password) {
    const stored = localStorage.getItem(ADMIN_KEY)
    if (!stored) return false
    const admin = JSON.parse(stored)
    return admin.password === password
  },

  /**
   * Elimina TODOS los datos de la aplicación (reset completo).
   * Requiere contraseña del administrador para seguridad.
   * @param {string} password
   * @returns {{success: boolean, message: string}}
   */
  resetApp(password) {
    const stored = localStorage.getItem(ADMIN_KEY)
    if (!stored) {
      return { success: false, message: 'No hay datos para eliminar.' }
    }
    const admin = JSON.parse(stored)
    if (admin.password !== password) {
      return { success: false, message: 'Contraseña incorrecta. No se realizó ningún cambio.' }
    }

    // Eliminar todas las claves de la app
    const keysToRemove = [
      'paycontrol_admin',
      'paycontrol_session',
      'paycontrol_clients',
      'paycontrol_payments',
    ]
    keysToRemove.forEach((key) => localStorage.removeItem(key))

    return { success: true, message: 'Aplicación restablecida correctamente. Todos los datos han sido eliminados.' }
  },

  /**
   * Cierra la sesión actual.
   */
  logout() {
    localStorage.removeItem('paycontrol_session')
  },

  /**
   * Obtiene la sesión actual si existe.
   * @returns {object|null}
   */
  getSession() {
    const session = localStorage.getItem('paycontrol_session')
    return session ? JSON.parse(session) : null
  },

  /**
   * Verifica si ya existe un administrador.
   * @returns {boolean}
   */
  hasAdmin() {
    return !!localStorage.getItem(ADMIN_KEY)
  },
}

