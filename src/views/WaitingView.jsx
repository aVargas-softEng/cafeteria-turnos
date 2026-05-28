//Pantalla de espera del cliente. Aplica cambios de estado en tiempo real y reacciona con confeti (en caso de que el pedido este listo) o se produce un mensaje de cancelación.

import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { solicitarPermiso, escucharNotificaciones } from '../firebase/notifications'
import confetti from 'canvas-confetti'

function EsperaView({ turno, turnoId, onCancelar }) {
  const [estado, setEstado] = useState('en_preparacion')
  const [horario, setHorario] = useState('')
  const [ultimoLogro, setUltimoLogro] = useState(() => {
    try {
      const logro = localStorage.getItem('ultimoLogro')
      if (logro && logro !== 'undefined' && logro !== 'null') {
        return JSON.parse(logro)
      }
      return null
    } catch (e) {
      console.error('Error parsing ultimoLogro:', e)
      return null
    }
  })

  // Cierra y limpia logros
  const handleVolver = () => {
    localStorage.removeItem('ultimoLogro')
    if (typeof onCancelar === 'function') {
      onCancelar()
    }
  }

  //Recibe los cambios de estado de Firestore
  useEffect(() => {
    if (!turnoId) return
    const unsub = onSnapshot(doc(db, 'turnos', turnoId), (snap) => {
      if (!snap.exists()) {
        // Si el pedido fue borrado por el admin, redirigir automáticamente al menú
        handleVolver()
        return
      }
      const data = snap.data()
      const nuevoEstado = data.estado
      setEstado(nuevoEstado)
      if (data.horarioRecoleccion) {
        setHorario(data.horarioRecoleccion)
      }
      if (nuevoEstado === 'listo') {
        confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 }, colors: ['#2563eb', '#16a34a', '#facc15'] })
      }
    }, (error) => {
      console.error("Error al escuchar cambios del turno en Firestore:", error)
    })
    return () => unsub()
  }, [turnoId])

  //Registra el token FCM y revisa las notificaciones push
  useEffect(() => {
    const registrarToken = async () => {
      const token = await solicitarPermiso()
      console.log('Token obtenido:', token)
      if (token && turnoId) await updateDoc(doc(db, 'turnos', turnoId), { fcmToken: token })
    }
    registrarToken()
    escucharNotificaciones((payload) => console.log('Notificación recibida:', payload))
  }, [turnoId])

  //Estados finales
  if (estado === 'listo') return (
    <div className="min-h-screen bg-green-100 dark:bg-green-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-sm w-full text-center">
        {ultimoLogro && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-center">
            <p className="text-lg">⭐</p>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">¡Logro Desbloqueado!</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ultimoLogro.tipo}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{ultimoLogro.descripcion}</p>
          </div>
        )}
        <h2 className="text-2xl font-bold text-green-600 mb-2" role="alert">¡Tu orden está lista!</h2>
        <p className="text-gray-600 dark:text-gray-400">Pasa a ventanilla a pagar y recoger tu pedido.</p>
        {horario && <p className="text-sm font-bold text-green-700 dark:text-green-300 mt-2">Horario programado: {horario} hrs</p>}
        <button onClick={handleVolver} className="mt-6 px-6 py-3 bg-green-600 dark:bg-green-900 text-white rounded-xl font-semibold w-full">
          Hacer otro pedido
        </button>
      </div>
    </div>
  )

  if (estado === 'cancelado') return (
    <div className="min-h-screen bg-red-100 dark:bg-red-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-sm w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-2" role="alert">Tu orden fue cancelada</h2>
        <p className="text-gray-600 dark:text-gray-300">El personal de cafetería canceló tu pedido.</p>
        <button onClick={handleVolver} className="mt-6 px-6 py-3 bg-red-500 dark:bg-red-900 text-white rounded-xl font-semibold w-full">
          Volver al menú
        </button>
      </div>
    </div>
  )

  //Estado en preparación (el estado default)
  return (
    <div className="min-h-screen bg-blue-50 dark:bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-8 max-w-sm w-full text-center">
        {ultimoLogro && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 text-center">
            <p className="text-lg">⭐</p>
            <p className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wider">¡Logro Desbloqueado!</p>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{ultimoLogro.tipo}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{ultimoLogro.descripcion}</p>
          </div>
        )}
        <p className="text-gray-650 dark:text-gray-400 text-sm mb-1">Tu número de orden</p>
        <p className="text-7xl font-bold text-blue-600 dark:text-blue-400 mb-6" aria-label={`Tu número de orden es ${turno}`}>#{turno}</p>
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl p-4 mb-4">
          <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">Estado</p>
          <p className="text-lg font-bold text-gray-700 dark:text-gray-100 mt-1" aria-live="polite">En preparación</p>
          {horario && <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 font-semibold">⏰ Recolección programada: {horario} hrs</p>}
        </div>
        <p className="text-sm text-gray-400 dark:text-gray-500">Te avisaremos cuando tu orden esté lista</p>
      </div>
    </div>
  )
}

export default EsperaView