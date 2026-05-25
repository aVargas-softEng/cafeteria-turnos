//LoginView. El inicio de sesión para validar la entrada del personal de administración.
import { useState } from 'react'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

// Clases reutilizables para inputs y labels
const inputClass = "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1"

function LoginView({ onLogin }) {
  // Estado del formulario
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
   // Mensaje de error de autenticación
  const [error, setError] = useState('')
  // Indicador de carga al enviar
  const [cargando, setCargando] = useState(false)

  // Maneja el inicio de sesión con Firebase Authentication
  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      // Notifica al AdminView que el login fue exitoso
      onLogin()
    } catch (_e) { // eslint-disable-line no-unused-vars
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-sm w-full">
        {/*Encabezado*/}
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-6">
          Cafetería Universitaria
        </p>
        {/*Formulario de autenticación*/}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>Correo electrónico</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className={inputClass} placeholder="admin@cafeteria.com" required />
          </div>
          <div>
            <label className={labelClass}>Contraseña</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className={inputClass} placeholder="••••••••" required />
          </div>
          {/* Mensaje de error (solo visible si hay error) */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Botón de envío — deshabilitado mientras carga */}
          <button type="submit" disabled={cargando}
            className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50">
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginView