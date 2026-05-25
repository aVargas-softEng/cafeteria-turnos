// Panel de administración. Protegido por Firebase Auth.
// Muestra pedidos en preparación y listos en tiempo real.
import { useEffect, useState } from 'react'
import { db, auth } from '../firebase/config'
import { collection, onSnapshot, updateDoc, doc, query, orderBy, deleteDoc } from 'firebase/firestore'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import LoginView from './LoginView'

function AdminView() {

  //Estados
  const [pedidos, setPedidos] = useState([])
  const [usuario, setUsuario] = useState(null)
  const [verificando, setVerificando] = useState(true)

  //Auth: verifica sesión activa
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUsuario(user)
      setVerificando(false)
    })
    return () => unsub()
  }, [])

  //Firestore: BD de pedidos en tiempo real
  useEffect(() => {
    const q = query(collection(db, 'turnos'), orderBy('creadoEn', 'asc'))
    const unsub = onSnapshot(q, snap => {
      setPedidos(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    })
    return () => unsub()
  }, [])

  //Acciones sobre pedidos
  const handleListo = async (id) => await updateDoc(doc(db, 'turnos', id), { estado: 'listo' })
  const handleCancelar = async (id) => await updateDoc(doc(db, 'turnos', id), { estado: 'cancelado' })

  //Elimina todos los pedidos con estado 'listo' o 'cancelado'
  const handleLimpiar = async () => {
    const terminados = pedidos.filter(p => p.estado === 'listo' || p.estado === 'cancelado')
    await Promise.all(terminados.map(p => deleteDoc(doc(db, 'turnos', p.id))))
  }

  //Filtros de pedidos por estado
  const enPreparacion = pedidos.filter(p => p.estado === 'en_preparacion')
  const listos = pedidos.filter(p => p.estado === 'listo')
  const hayTerminados = pedidos.some(p => p.estado === 'listo' || p.estado === 'cancelado')
  const totalDia = pedidos
  .filter(p => p.estado === 'listo')
  .reduce((acc, p) => acc + p.total, 0)

  //Verificaciones de sesión
  if (verificando) return null
  if (!usuario) return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
      <LoginView onLogin={() => {}} />
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">

      {/*Cabecera*/}
      <div className="flex flex-col items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center">
          Panel de Administración
        </h1>
        <button onClick={() => signOut(auth)}
          className="px-6 py-1 bg-red-500 dark:bg-red-900 text-white text-sm rounded-lg font-medium">
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-2xl mx-auto">

        {/*Sección: pedidos en preparación*/}
        <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
          En preparación ({enPreparacion.length})
        </h2>
        {enPreparacion.length === 0 && (
          <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">No hay pedidos en preparación</p>
        )}
        {enPreparacion.map(p => (
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">Orden #{p.turno}</span>
              <span className="text-gray-700 dark:text-gray-200 font-semibold">${p.total}</span>
            </div>
            <ul className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {p.items.map((item, i) => <li key={i}>{item.nombre} x{item.cantidad}</li>)}
            </ul>
            <button onClick={() => handleListo(p.id)}
              className="w-full py-3 bg-green-600 dark:bg-green-900 text-white rounded-xl font-semibold">
              Pedido listo
            </button>
            <button onClick={() => handleCancelar(p.id)}
              className="w-full py-3 mt-2 bg-red-500 dark:bg-red-900 text-white rounded-xl font-semibold">
              Cancelar pedido
            </button>
          </div>
        ))}

        {/*Sección: pedidos listos*/}
        {listos.length > 0 && (
          <>
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-3">
              Listos ({listos.length})
            </h2>
            {listos.map(p => (
              <div key={p.id} className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-xl p-4 mb-3 opacity-60">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 dark:text-green-400 font-bold">Orden #{p.turno}</span>
                  <span className="text-gray-600 text-sm">${p.total}</span>
                </div>
              </div>
            ))}
          </>
        )}

          {/*Botón para limpiar pedidos terminados: visible solo cuando existen*/}
          {hayTerminados && (
            <button onClick={handleLimpiar}
              className="block mx-auto mb-4 px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium">
              Limpiar pedidos terminados
            </button>
          )}

        {/*Total de ganancias del día*/}
          <div className="mt-6 bg-white dark:bg-gray-600 rounded-xl shadow p-4 flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300 font-medium">Total del día</span>
            <span className="text-green-600 dark:text-green-400 font-bold text-xl">${totalDia}</span>
          </div>
      </div>
    </div>
  )
}

export default AdminView