import { useEffect, useState } from 'react'
import { db, auth } from '../firebase/config'
import { collection, onSnapshot, updateDoc, doc, query, orderBy } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import LoginView from './LoginView'

function AdminView() {
  const [pedidos, setPedidos] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [verificando, setVerificando] = useState(true)

    useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setVerificando(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('creadoEn', 'asc'))
    const unsub = onSnapshot(q, (snap) => {
      setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  const handleListo = async (id) => {
    await updateDoc(doc(db, 'turnos', id), { estado: 'listo' })
  }

  const handleCancelar = async (id) => {
  await updateDoc(doc(db, 'turnos', id), { estado: 'cancelado' })
}

  const enPreparacion = pedidos.filter(p => p.estado === 'en_preparacion')
  const listos = pedidos.filter(p => p.estado === 'listo')

  if (verificando) return null
  if (!usuario) return <LoginView onLogin={() => {}} />

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="relative flex items-center justify-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Panel de Administración</h1>
        <button onClick={() => signOut(auth)} className="absolute right-0 px-3 py-1 bg-red-500 text-white text-sm rounded-lg font-medium">Cerrar sesión</button>
      </div>

      <div className="max-w-2xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-600 mb-3">
          En preparación ({enPreparacion.length})
        </h2>

        {enPreparacion.length === 0 && (
          <p className="text-gray-400 text-sm mb-6">No hay pedidos en preparación</p>
        )}

        {enPreparacion.map(p => (
          <div key={p.id} className="bg-white rounded-xl shadow p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-600 font-bold text-xl">Orden #{p.turno}</span>
              <span className="text-gray-700 font-semibold">${p.total}</span>
            </div>
            <ul className="text-sm text-gray-600 mb-4">
              {p.items.map((item, i) => (
                <li key={i}>{item.nombre} x{item.cantidad}</li>
              ))}
            </ul>
            <button
              onClick={() => handleListo(p.id)}
              className="w-full py-2 bg-green-600 text-white rounded-xl font-semibold"
            >
             Pedido listo
            </button>
            <button
                onClick={() => handleCancelar(p.id)}
                className="w-full py-2 mt-2 bg-red-500 text-white rounded-xl font-semibold"
              >
                Cancelar pedido
              </button>
          </div>
        ))}

        {listos.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-600 mb-3 mt-6">
              Listos ({listos.length})
            </h2>
            {listos.map(p => (
              <div key={p.id} className="bg-green-50 border border-green-200 rounded-xl p-4 mb-3 opacity-60">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-bold">Orden #{p.turno}</span>
                  <span className="text-gray-500 text-sm">${p.total}</span>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default AdminView