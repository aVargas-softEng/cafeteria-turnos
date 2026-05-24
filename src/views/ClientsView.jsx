import { useState } from 'react'
import { db } from '../firebase/config'
import { doc, runTransaction, collection, serverTimestamp } from 'firebase/firestore'
import EsperaView from './WaitingView'


const menu = [
  {
    categoria: 'Orden del día',
    items: [
      { id: 1, nombre: 'Orden del día completa', descripcion: 'Guisado + arroz + frijoles + tortillas', precio: 45 },
      { id: 2, nombre: 'Media orden', descripcion: 'Guisado + tortillas', precio: 25 },
    ]
  },
  {
    categoria: 'Tortas',
    items: [
      { id: 3, nombre: 'Torta de jamón', descripcion: 'Torta de jamón con queso y lechuga', precio: 30 },
      { id: 4, nombre: 'Torta de panela', descripcion: 'Panela fresca y lechuga', precio: 35 },
      { id: 5, nombre: 'Torta de pierna', descripcion: 'Pierna de cerdo, lechuga y salsa', precio: 35 },
    ]
  },
  {
    categoria: 'Tacos',
    items: [
      { id: 6, nombre: 'Tacos dorados', descripcion: '3 tacos de papa dorados, sin carne', precio: 20},
      { id: 7, nombre: 'Tacos tuxpeños', descripcion: '3 tacos de frijoles, carne o papa', precio: 25 },
    ]
  },
  {
    categoria: 'Bebidas',
    items: [
      { id: 8, nombre: 'Agua fresca', descripcion: 'Sabor del día', precio: 15 },
      { id: 9, nombre: 'Café', descripcion: 'Café negro', precio: 35 },
      { id: 10, nombre: 'Jugo natural', descripcion: 'Naranja o zanahoria', precio: 20 },
    ]
  },
]
const todosLosItems = menu.flatMap(c => c.items)


function ClienteView() {
  const [carrito, setCarrito] = useState({})
  const [confirmado, setConfirmado] = useState(false)
  const [error, setError] = useState('')
  const [numeroTurno, setNumeroTurno] = useState(null)
  const [turnoId, setTurnoId] = useState(null)

  const productosDistintos = Object.keys(carrito).length
  const total = Object.entries(carrito).reduce((acc, [id, cantidad]) => {
    const item = menu.flatMap(c => c.items).find(i => i.id === parseInt(id))
    return acc + item.precio * cantidad
  }, 0)

    const handleAgregar = (item) => {
        const cantidadActual = carrito[item.id] || 0
        const totalDistintos = Object.keys(carrito).length
        const totalItems = Object.values(carrito).reduce((acc, c) => acc + c, 0)  // ← suma total

        if (cantidadActual >= 2) {
            setError(`Máximo 2 unidades de "${item.nombre}"`)
            return
        }
        if (cantidadActual === 0 && totalDistintos >= 5) {
            setError('Máximo 5 productos distintos por orden')
            return
        }
        if (totalItems >= 5) {   
            setError('Máximo 5 items en total por orden')
            return
        }

        setError('')
        setCarrito(prev => ({ ...prev, [item.id]: cantidadActual + 1 }))
        }

  const handleConfirmar = async () => {
  if (productosDistintos === 0) {
    setError('Debes seleccionar al menos un producto')
    return
  }

  try {
    const contadorRef = doc(db, 'config', 'contador')
    const turnosRef = collection(db, 'turnos')
    const nuevoTurnoRef = doc(turnosRef)  


    let numeroTurno

    await runTransaction(db, async (transaction) => {
        const contadorDoc = await transaction.get(contadorRef)
        numeroTurno = contadorDoc.data().ultimo + 1

        transaction.update(contadorRef, { ultimo: numeroTurno })
        transaction.set(nuevoTurnoRef, {
            turno: numeroTurno,
            items: Object.entries(carrito).map(([id, cantidad]) => {
            const item = todosLosItems.find(i => i.id === parseInt(id))
            return { nombre: item.nombre, cantidad, precio: item.precio }
            }),
            total,
            estado: 'en_preparacion',
            creadoEn: serverTimestamp()
        })
        })

    setNumeroTurno(numeroTurno)
    setTurnoId(nuevoTurnoRef.id)
    setConfirmado(true)
  // eslint-disable-next-line no-unused-vars
  } catch (_e) {
    setError('Error al generar turno, intenta de nuevo')
  }
}

  const handleQuitar = (item) => {
  const cantidadActual = carrito[item.id] || 0
  if (cantidadActual === 0) return
  setError('')
  setCarrito(prev => {
    const nuevo = { ...prev }
    if (cantidadActual === 1) {
      delete nuevo[item.id]
    } else {
      nuevo[item.id] = cantidadActual - 1
    }
    return nuevo
  })
}

  const handleCancelar = () => {
    setCarrito({})
    setConfirmado(false)
    setError('')
  }

  if (confirmado) {
  return <EsperaView turno={numeroTurno} turnoId={turnoId} onCancelar={handleCancelar} />
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 pb-40">
      <h1 className="text-2xl font-bold text-center text-blue-700 mb-2">
        Cafetería — Selecciona tu pedido
      </h1>
      <p className="text-center text-sm text-gray-500 mb-6">
        Máximo 5 items en total · Máximo 2 de cada producto
      </p>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {menu.map((categoria) => (
          <div key={categoria.categoria} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-600 mb-2 border-b pb-1">
              {categoria.categoria}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {categoria.items.map((item) => {
                const cantidad = carrito[item.id] || 0
                return (
                  <div
                    key={item.id}
                    className={`p-4 rounded-lg border-2 bg-white transition-all ${
                      cantidad > 0 ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{item.nombre}</p>
                        <p className="text-sm text-gray-500">{item.descripcion}</p>
                      </div>
                      <span className="text-blue-600 font-bold ml-4">${item.precio}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleQuitar(item)}
                        className="w-8 h-8 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100"
                        aria-label={`Quitar una unidad de ${item.nombre}`}
                      >
                        −
                      </button>
                      <span className="w-4 text-center font-medium text-gray-800">
                        {cantidad}
                      </span>
                      <button
                        onClick={() => handleAgregar(item)}
                        className="w-8 h-8 rounded-full border border-blue-500 text-blue-600 font-bold hover:bg-blue-50"
                        aria-label={`Agregar una unidad de ${item.nombre}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {productosDistintos > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500">{productosDistintos} producto(s) seleccionado(s)</p>
            <p className="text-blue-600 font-bold text-lg">${total}</p>
          </div>
          <button
            onClick={handleConfirmar}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            Confirmar orden
          </button>
        </div>
      )}
    </div>
  )
}

export default ClienteView