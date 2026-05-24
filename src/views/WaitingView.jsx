import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { doc, onSnapshot, updateDoc } from 'firebase/firestore'
import { solicitarPermiso, escucharNotificaciones } from '../firebase/notifications'
import confetti from 'canvas-confetti'

function EsperaView({ turno, turnoId, onCancelar }) {
  const [estado, setEstado] = useState('en_preparacion')

  useEffect(() => {
  if (!turnoId) return
  const ref = doc(db, 'turnos', turnoId)
  const unsub = onSnapshot(ref, (snap) => {
    if (snap.exists()) {
      const nuevoEstado = snap.data().estado
      setEstado(nuevoEstado)
      if (nuevoEstado === 'listo') {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#16a34a', '#facc15']
        })
      }
    }
  })
  return () => unsub()
}, [turnoId])

  useEffect(() => {
  const registrarToken = async () => {
    const token = await solicitarPermiso()
    console.log('Token obtenido:', token)
    if (token && turnoId) {
      await updateDoc(doc(db, 'turnos', turnoId), { fcmToken: token })
    }
  }
  registrarToken()

  escucharNotificaciones((payload) => {
    console.log('Notificación recibida:', payload)
  })
}, [turnoId])


  if (estado === 'listo') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2" role="alert">¡Tu orden está lista!</h2>
          <p className="text-gray-600">Pasa a ventanilla a pagar y recoger tu pedido.</p>
          <button
            onClick={onCancelar}
            className="mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold w-full"
          >
            Hacer otro pedido
          </button>
        </div>
      </div>
    )
  }

    if (estado === 'cancelado') {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2" role="alert">Tu orden fue cancelada</h2>
          <p className="text-gray-600">El personal de cafetería canceló tu pedido.</p>
          <button
            onClick={onCancelar}
            className="mt-6 px-6 py-3 bg-red-500 text-white rounded-xl font-semibold w-full"
          >
            Volver al menú
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center">
        <p className="text-gray-600 text-sm mb-1">Tu número de orden</p>
        <p className="text-7xl font-bold text-blue-600 mb-6" aria-label={`Tu número de orden es ${turno}`}>#{turno}</p>
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-gray-600 text-sm">Estado</p>
          <p className="text-lg font-semibold text-gray-700 mt-1" aria-live="polite">En preparación</p>
        </div>
        <p className="text-sm text-gray-400">Te avisaremos cuando tu orden esté lista</p>
      </div>
    </div>
  )
}

export default EsperaView