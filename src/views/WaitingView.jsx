import { useEffect, useState } from 'react'
import { db } from '../firebase/config'
import { doc, onSnapshot, deleteDoc, updateDoc } from 'firebase/firestore'
import { solicitarPermiso, escucharNotificaciones } from '../firebase/notifications'

function EsperaView({ turno, turnoId, onCancelar }) {
  const [estado, setEstado] = useState('en_preparacion')

  useEffect(() => {
    if (!turnoId) return
    const ref = doc(db, 'turnos', turnoId)
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setEstado(snap.data().estado)
      }
    })
    return () => unsub()
  }, [turnoId])

  useEffect(() => {
  const registrarToken = async () => {
    const token = await solicitarPermiso()
    if (token && turnoId) {
      await updateDoc(doc(db, 'turnos', turnoId), { fcmToken: token })
    }
  }
  registrarToken()

  escucharNotificaciones((payload) => {
    console.log('Notificación recibida:', payload)
  })
}, [turnoId])

  const handleCancelar = async () => {
    try {
      await deleteDoc(doc(db, 'turnos', turnoId))
    } catch (e) {
      console.error(e)
    }
    onCancelar()
  }

  if (estado === 'listo') {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow p-8 max-w-sm w-full text-center">
          <h2 className="text-2xl font-bold text-green-600 mb-2">¡Tu orden está lista!</h2>
          <p className="text-gray-500">Pasa a ventanilla a pagar y recoger tu pedido.</p>
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
          <h2 className="text-2xl font-bold text-red-600 mb-2">Tu orden fue cancelada</h2>
          <p className="text-gray-500">El personal de cafetería canceló tu pedido.</p>
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
        <p className="text-gray-500 text-sm mb-1">Tu número de orden</p>
        <p className="text-7xl font-bold text-blue-600 mb-6">#{turno}</p>
        <div className="bg-gray-100 rounded-xl p-4 mb-4">
          <p className="text-gray-500 text-sm">Estado</p>
          <p className="text-lg font-semibold text-gray-700 mt-1">En preparación</p>
        </div>
        <p className="text-sm text-gray-400">Te avisaremos cuando tu orden esté lista</p>
        <button
          onClick={handleCancelar}
          className="mt-6 text-sm text-red-500 underline"
        >
          Cancelar pedido
        </button>
      </div>
    </div>
  )
}

export default EsperaView