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

  //Filtros de pedidos por estado (ordenados por horario de recolección)
  const enPreparacion = pedidos
    .filter(p => p.estado === 'en_preparacion')
    .sort((a, b) => {
      if (a.horarioRecoleccion && b.horarioRecoleccion) {
        if (a.horarioRecoleccion !== b.horarioRecoleccion) {
          return a.horarioRecoleccion.localeCompare(b.horarioRecoleccion)
        }
      } else if (a.horarioRecoleccion) {
        return -1
      } else if (b.horarioRecoleccion) {
        return 1
      }
      return a.turno - b.turno
    })
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
          <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-3 border-l-4 border-blue-500">
            <div className="flex justify-between items-start mb-2">
              <div className="flex flex-col">
                <span className="text-blue-600 dark:text-blue-300 font-bold text-xl">Orden #{p.turno}</span>
                {p.horarioRecoleccion && (
                  <span className="text-xs text-gray-550 dark:text-gray-400 font-semibold mt-0.5">
                     Recolección: <span className="text-blue-600 dark:text-blue-400 font-bold">{p.horarioRecoleccion} hrs</span>
                  </span>
                )}
              </div>
              <span className="text-gray-700 dark:text-gray-200 font-bold text-lg">${p.total}</span>
            </div>
            <ul className="text-sm text-gray-650 dark:text-gray-400 mb-4 divide-y divide-gray-100 dark:divide-gray-700">
              {p.items.map((item, i) => (
                <li key={i} className="py-1">
                  <div>
                    <span>{item.nombre} <span className="font-bold text-gray-800 dark:text-gray-200">x{item.cantidad}</span></span>
                  </div>
                  {item.nota && (
                    <span className="block text-xs text-amber-600 dark:text-amber-400 font-medium italic pl-2 mt-0.5">
                      ↳ Nota: "{item.nota}"
                    </span>
                  )}
                </li>
              ))}
            </ul>
            <button onClick={() => handleListo(p.id)}
              className="w-full py-3 bg-green-600 dark:bg-green-800 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors">
              Pedido listo
            </button>
            <button onClick={() => handleCancelar(p.id)}
              className="w-full py-3 mt-2 bg-red-500 dark:bg-red-800 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors">
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
              <div key={p.id} className="bg-green-55 dark:bg-green-950/30 border border-green-200 dark:border-green-900 rounded-xl p-4 mb-3 opacity-70">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 dark:text-green-400 font-bold">Orden #{p.turno}</span>
                    {p.horarioRecoleccion && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">({p.horarioRecoleccion} hrs)</span>
                    )}
                  </div>
                  <span className="text-gray-600 dark:text-gray-100 text-sm font-semibold">${p.total}</span>
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