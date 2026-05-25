//Vista principal del cliente: menú, carrito y generación de turno en Firebase.
import { useState } from 'react'
import { db } from '../firebase/config'
import { doc, runTransaction, collection, serverTimestamp } from 'firebase/firestore'
import EsperaView from './WaitingView'

//MENÚ
const menu = [
  {
    categoria: 'Bebidas',
    items: [
      { id: 1,  nombre: 'Jugo verde',           descripcion: '250ml', precio: 25 },
      { id: 2,  nombre: 'Jugo natural de naranja', descripcion: '250ml', precio: 25 },
      { id: 3,  nombre: 'Agua de sabor',         descripcion: '250ml', precio: 15 },
      { id: 4,  nombre: 'Chocomilk',             descripcion: '250ml', precio: 20 },
      { id: 5,  nombre: 'Vaso con leche',        descripcion: '250ml', precio: 15 },
      { id: 6,  nombre: 'Café',                  descripcion: '250ml', precio: 20 },
      { id: 7,  nombre: 'Té',                    descripcion: '250ml', precio: 15 },
      { id: 8,  nombre: 'Licuado de frutas',     descripcion: '250ml', precio: 30 },
    ]
  },
  {
    categoria: 'Desayunos',
    items: [
      { id: 9,  nombre: 'Orden de huevos',    descripcion: 'Huevos al gusto con frijoles y tortillas', precio: 50 },
      { id: 10, nombre: 'Enchiladas suizas',  descripcion: '3 enchiladas con crema y queso',           precio: 55 },
      { id: 11, nombre: 'Chilaquiles',        descripcion: 'Con crema, queso y pollo',                 precio: 50 },
      { id: 12, nombre: 'Desayuno completo',  descripcion: 'Huevo, frijoles y café',                   precio: 60 },
    ]
  },
  {
    categoria: 'Tortas',
    items: [
      { id: 13, nombre: 'Torta de lomo',    descripcion: 'Lomo, frijoles y chile',              precio: 40 },
      { id: 14, nombre: 'Torta hawaiiana',  descripcion: 'Jamón, piña y queso',                 precio: 45 },
      { id: 15, nombre: 'Torta cubana',     descripcion: 'Surtida con jamón, milanesa y queso', precio: 45 },
      { id: 16, nombre: 'Torta de panela',  descripcion: 'Panela fresca y lechuga',             precio: 35 },
      { id: 17, nombre: 'Torta de jamón',   descripcion: 'Jamón, queso y lechuga',              precio: 35 },
    ]
  },
  {
    categoria: 'Antojitos mexicanos',
    items: [
      { id: 18, nombre: 'Enfrijoladas',             descripcion: '3 enfrijoladas con queso y crema',        precio: 40 },
      { id: 19, nombre: 'Flautas de pollo',         descripcion: '3 flautas con crema y guacamole',         precio: 45 },
      { id: 20, nombre: 'Sopitos',                  descripcion: '3 sopitos con frijoles y queso',          precio: 40 },
      { id: 21, nombre: 'Sincronizada',             descripcion: 'Jamón y queso en tortilla de harina',     precio: 45 },
      { id: 22, nombre: 'Molletes con mantequilla', descripcion: 'Con frijoles y queso gratinado',          precio: 30 },
    ]
  },
  {
    categoria: 'Complementos',
    items: [
      { id: 23, nombre: 'Gelatina', descripcion: 'Sabor del día',      precio: 15 },
      { id: 24, nombre: 'Fruta',    descripcion: 'Fruta de temporada', precio: 20 },
    ]
  },
  {
    categoria: 'Crepería',
    items: [
      { id: 25, nombre: 'Crepas',            descripcion: '3 crepas con relleno dulce o salado',   precio: 50 },
      { id: 26, nombre: 'Orden de hotcakes', descripcion: '3 hotcakes con miel y mantequilla',     precio: 45 },
    ]
  },
  {
    categoria: 'Sandwich',
    items: [
      { id: 27, nombre: 'Sandwich de lomo',   descripcion: 'Lomo, lechuga y tomate',      precio: 40 },
      { id: 28, nombre: 'Sandwich de pollo',  descripcion: 'Pollo, lechuga y mayonesa',   precio: 40 },
      { id: 29, nombre: 'Sandwich de panela', descripcion: 'Panela fresca y lechuga',     precio: 35 },
      { id: 30, nombre: 'Sandwich de jamón',  descripcion: 'Jamón, queso y mostaza',      precio: 35 },
    ]
  },
  {
    categoria: 'Pachucos',
    items: [
      { id: 31, nombre: 'Medio pachuco con carne', descripcion: 'Tortilla con frijoles, carne y queso', precio: 50 },
      { id: 32, nombre: 'Medio pachuco sencillo',  descripcion: 'Tortilla con frijoles y queso',        precio: 40 },
    ]
  },
  {
    categoria: 'Comida Rápida',
    items: [
      { id: 33, nombre: 'Hamburguesa sin papas', descripcion: 'Carne, lechuga, tomate y queso',               precio: 50 },
      { id: 34, nombre: 'Hamburguesa con papas', descripcion: 'Carne, lechuga, tomate, queso y papas fritas', precio: 60 },
      { id: 35, nombre: 'Hot dog',               descripcion: 'Salchicha con mostaza y catsup',               precio: 40 },
      { id: 36, nombre: 'Papas a la francesa',   descripcion: 'Porción individual con catsup',                precio: 35 },
      { id: 37, nombre: 'Burritos',              descripcion: '3 burritos con frijoles y queso',              precio: 45 },
    ]
  },
  {
    categoria: 'Guisos',
    items: [
      { id: 38, nombre: 'Guiso del día con agua', descripcion: 'Guiso del día con arroz, frijoles y agua', precio: 55 },
      { id: 39, nombre: 'Guiso del día sin agua', descripcion: 'Guiso del día con arroz y frijoles',       precio: 45 },
    ]
  },
  {
    categoria: 'Tacos',
    items: [
      { id: 40, nombre: 'Taquitos de adobada', descripcion: '3 tacos con cebolla y cilantro',   precio: 35 },
      { id: 41, nombre: 'Tacos tuxpeños',      descripcion: '3 tacos de frijoles, carne o papa', precio: 35 },
    ]
  },
  {
    categoria: 'Ensalada',
    items: [
      { id: 42, nombre: 'Ensalada de pollo', descripcion: 'Pollo, lechuga, tomate y aderezo', precio: 50 },
    ]
  },
]

const todosLosItems = menu.flatMap(c => c.items)

//Componente principal 

function ClienteView() {

  //Estados
  const [carrito, setCarrito] = useState({})
  const [confirmado, setConfirmado] = useState(false)
  const [error, setError] = useState('')
  const [numeroTurno, setNumeroTurno] = useState(null)
  const [turnoId, setTurnoId] = useState(null)

  //Validación del máximo y mínimo del carrito
  const productosDistintos = Object.keys(carrito).length
  const total = Object.entries(carrito).reduce((acc, [id, cantidad]) => {
    const item = todosLosItems.find(i => i.id === parseInt(id))
    return acc + item.precio * cantidad
  }, 0)

  //Saludo contextual (ludificación)
  const getSaludo = () => {
    const hora = new Date().getHours()
    if (hora >= 6  && hora < 12) return '¡Buenos días! ¿Qué vas a desayunar hoy?'
    if (hora >= 12 && hora < 15) return '¡Buenas tardes! ¿Qué se te antoja?'
    return '¡Hola! ¿En qué podemos ayudarte?'
  }

  //Handlers para el control 

  const handleAgregar = (item) => {
    const cantidadActual = carrito[item.id] || 0
    const totalDistintos = Object.keys(carrito).length
    const totalItems = Object.values(carrito).reduce((acc, c) => acc + c, 0)

    if (cantidadActual >= 2) return setError(`Máximo 2 unidades de "${item.nombre}"`)
    if (cantidadActual === 0 && totalDistintos >= 5) return setError('Máximo 5 productos distintos por orden')
    if (totalItems >= 5) return setError('Máximo 5 items en total por orden')

    setError('')
    setCarrito(prev => ({ ...prev, [item.id]: cantidadActual + 1 }))
  }

  const handleQuitar = (item) => {
    const cantidadActual = carrito[item.id] || 0
    if (cantidadActual === 0) return
    setError('')
    setCarrito(prev => {
      const nuevo = { ...prev }
      cantidadActual === 1 ? delete nuevo[item.id] : nuevo[item.id] = cantidadActual - 1
      return nuevo
    })
  }

  const handleConfirmar = async () => {
    if (productosDistintos === 0) return setError('Debes seleccionar al menos un producto')

    try {
      const contadorRef = doc(db, 'config', 'contador')
      const nuevoTurnoRef = doc(collection(db, 'turnos')) //Se generan ID antes de la transaccion. 
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
    //eslint-disable-next-line no-unused-vars
    } catch (_e) {
      setError('Error al generar turno, intenta de nuevo')
    }
  }

  const handleCancelar = () => {
    setCarrito({})
    setConfirmado(false)
    setError('')
  }

  //Renderizado
  if (confirmado) return <EsperaView turno={numeroTurno} turnoId={turnoId} onCancelar={handleCancelar} />

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 pb-40">
      <h1 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-300 mb-1">Cafetería Universitaria</h1>
      <p className="text-center text-blue-500 dark:text-blue-300 text-base font-medium mb-2">{getSaludo()}</p>
      <p className="text-center text-sm text-gray-600 dark:text-gray-400 mb-6">Máximo 5 items en total - Máximo 2 de cada producto</p>

      {error && (
        <div className="max-w-2xl mx-auto mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-2 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        {menu.map((categoria) => (
          <div key={categoria.categoria} className="mb-6">
            <h2 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2 border-b border-gray-200 dark:border-gray-700 pb-1">
              {categoria.categoria}
            </h2>
            <div className="grid grid-cols-1 gap-3">
              {categoria.items.map((item) => {
                const cantidad = carrito[item.id] || 0
                return (
                  <div
                    key={item.id}
                    role="region"
                    aria-label={`${item.nombre}, $${item.precio}`}
                    className={`p-4 rounded-lg border-2 bg-white dark:bg-gray-800 transition-all ${
                      cantidad > 0 ? 'border-blue-500' : 'border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800 dark:text-gray-100">{item.nombre}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{item.descripcion}</p>
                      </div>
                      <span className="text-blue-600 dark:text-blue-300 font-bold ml-4">${item.precio}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button onClick={() => handleQuitar(item)} className="w-11 h-11 rounded-full border border-gray-300 text-gray-600 font-bold hover:bg-gray-100 dark:hover:bg-gray-50" aria-label={`Quitar una unidad de ${item.nombre}`}>−</button>
                      <span className="w-4 text-center font-medium text-gray-800 dark:text-gray-100">{cantidad}</span>
                      <button onClick={() => handleAgregar(item)} className="w-11 h-11 rounded-full border border-blue-500 dark:border-blue-400 text-blue-600 dark:text-blue-300 font-bold hover:bg-blue-50 dark:hover:bg-gray-500" aria-label={`Agregar una unidad de ${item.nombre}`}>+</button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {productosDistintos > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-100">{productosDistintos} producto(s) seleccionado(s)</p>
            <p className="text-blue-600 dark:text-blue-300 font-bold text-lg">${total}</p>
          </div>
          <button onClick={handleConfirmar} className="px-6 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold text-base min-h-[44px]">
            Confirmar orden
          </button>
        </div>
      )}
    </div>
  )
}

export default ClienteView