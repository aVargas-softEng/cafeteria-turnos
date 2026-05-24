import { useState } from 'react'
import { auth } from '../firebase/config'
import { signInWithEmailAndPassword } from 'firebase/auth'

function LoginView({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      onLogin()
        // eslint-disable-next-line no-unused-vars
    } catch (_e) {
      setError('Correo o contraseña incorrectos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-2">
          Panel de Administración
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm text-center mb-6">
          Cafetería Universitaria
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="admin@cafeteria.com"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
           className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold disabled:opacity-50"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginView