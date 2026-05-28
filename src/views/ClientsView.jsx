//Vista principal del cliente: menú, carrito y generación de turno en Firebase.
import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { doc, runTransaction, collection, serverTimestamp, query, where, onSnapshot, setDoc } from 'firebase/firestore'
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
  
  // Nuevos Estados para Mejoras
  const [horarioSeleccionado, setHorarioSeleccionado] = useState('')
  const [horariosSaturados, setHorariosSaturados] = useState([])
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false)
  const [historialList, setHistorialList] = useState([])
  const [medallasList, setMedallasList] = useState([])

  // Identificador de cliente único y persistente
  const [clienteId] = useState(() => {
    let id = localStorage.getItem('clienteId')
    if (!id) {
      id = 'cli_' + Math.random().toString(36).substring(2, 11)
      localStorage.setItem('clienteId', id)
    }
    return id
  })

  // Efecto para restaurar sesión activa
  useEffect(() => {
    const savedId = localStorage.getItem('turnoActivoId')
    const savedNumero = localStorage.getItem('turnoActivoNumero')
    
    const isValidId = savedId && savedId !== 'undefined' && savedId !== 'null' && savedId.trim() !== ''
    const isValidNumero = savedNumero && savedNumero !== 'undefined' && savedNumero !== 'null' && savedNumero.trim() !== ''
    
    if (isValidId && isValidNumero) {
      const parsedNum = parseInt(savedNumero, 10)
      if (!isNaN(parsedNum)) {
        setTurnoId(savedId)
        setNumeroTurno(parsedNum)
        setConfirmado(true)
      }
    }
  }, [])

  // Efecto para escuchar el historial del cliente en tiempo real desde Firestore
  useEffect(() => {
    if (!clienteId) return
    const q = query(
      collection(db, 'turnos'),
      where('clienteId', '==', clienteId)
    )
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map(d => {
        const data = d.data()
        return {
          id: d.id,
          ...data,
          fecha: data.creadoEn ? new Date(data.creadoEn.seconds * 1000).toLocaleDateString() : new Date().toLocaleDateString()
        }
      })
      setHistorialList(list)
    }, (err) => {
      console.error("Error al obtener historial de Firestore: ", err)
    })
    return () => unsub()
  }, [clienteId])

  // Efecto para escuchar las medallas del cliente en tiempo real desde Firestore
  useEffect(() => {
    if (!clienteId) return
    const unsub = onSnapshot(doc(db, 'clientes', clienteId), (snap) => {
      if (snap.exists()) {
        setMedallasList(snap.data().medallas || [])
      } else {
        setMedallasList([])
      }
    }, (err) => {
      console.error("Error al obtener medallas de Firestore: ", err)
    })
    return () => unsub()
  }, [clienteId])

  // Efecto para escuchar la saturación de horarios del día en tiempo real
  useEffect(() => {
    const hoy = new Date()
    hoy.setHours(0, 0, 0, 0)
    const q = query(
      collection(db, 'turnos'),
      where('creadoEn', '>=', hoy)
    )
    const unsub = onSnapshot(q, (snap) => {
      const counts = {}
      snap.docs.forEach(docSnap => {
        const data = docSnap.data()
        if (data.estado !== 'cancelado' && data.horarioRecoleccion) {
          counts[data.horarioRecoleccion] = (counts[data.horarioRecoleccion] || 0) + 1
        }
      })
      // Límite de 5 pedidos por bloque de 15 minutos
      const saturados = Object.keys(counts).filter(time => counts[time] >= 5)
      setHorariosSaturados(saturados)
    }, (err) => {
      console.error("Error al obtener saturación de horarios: ", err)
    })
    return () => unsub()
  }, [])

  //Validación del máximo y mínimo del carrito
  const productosDistintos = Object.keys(carrito).length
  const total = Object.entries(carrito).reduce((acc, [id, data]) => {
    const item = todosLosItems.find(i => i.id === parseInt(id))
    return acc + item.precio * data.cantidad
  }, 0)

  //Saludo contextual (ludificación)
  const getSaludo = () => {
    const hora = new Date().getHours()
    if (hora >= 6  && hora < 12) return '¡Buenos días! ¿Qué vas a desayunar hoy?'
    if (hora >= 12 && hora < 15) return '¡Buenas tardes! ¿Qué se te antoja?'
    return '¡Hola! ¿En qué podemos ayudarte?'
  }

  // Genera los bloques de horario cada 15 minutos
  const obtenerBloquesHorarios = () => {
    const bloques = []
    const ahora = new Date()
    const inicio = new Date()
    inicio.setHours(8, 0, 0, 0) // Abre 8:00 AM
    const fin = new Date()
    fin.setHours(18, 0, 0, 0)   // Cierra 6:00 PM

    // Minutos de anticipación mínima para preparar (15 min)
    let temp = new Date(ahora.getTime() + 15 * 60 * 1000)
    
    // Redondear al bloque de 15 min más cercano
    const minutos = temp.getMinutes()
    const residuo = minutos % 15
    if (residuo !== 0) {
      temp.setMinutes(minutos + (15 - residuo), 0, 0)
    } else {
      temp.setSeconds(0, 0)
    }

    if (temp < inicio) {
      temp = new Date(inicio)
    }

    while (temp < fin) {
      const horaStr = temp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      bloques.push(horaStr)
      temp.setMinutes(temp.getMinutes() + 15)
    }
    return bloques
  }

  //Handlers para el control 

  const handleAgregar = (item) => {
    const itemData = carrito[item.id] || { cantidad: 0, nota: '' }
    const cantidadActual = itemData.cantidad
    const totalDistintos = Object.keys(carrito).length
    const totalItems = Object.values(carrito).reduce((acc, c) => acc + c.cantidad, 0)

    if (cantidadActual >= 2) return setError(`Máximo 2 unidades de "${item.nombre}"`)
    if (cantidadActual === 0 && totalDistintos >= 5) return setError('Máximo 5 productos distintos por orden')
    if (totalItems >= 5) return setError('Máximo 5 items en total por orden')

    setError('')
    setCarrito(prev => ({
      ...prev,
      [item.id]: { cantidad: cantidadActual + 1, nota: itemData.nota || '' }
    }))
  }

  const handleQuitar = (item) => {
    const itemData = carrito[item.id]
    if (!itemData || itemData.cantidad === 0) return
    setError('')
    setCarrito(prev => {
      const nuevo = { ...prev }
      if (itemData.cantidad === 1) {
        delete nuevo[item.id]
      } else {
        nuevo[item.id] = { cantidad: itemData.cantidad - 1, nota: itemData.nota }
      }
      return nuevo
    })
  }

  const handleNotaChange = (itemId, notaText) => {
    setCarrito(prev => {
      if (!prev[itemId]) return prev
      return {
        ...prev,
        [itemId]: { ...prev[itemId], nota: notaText }
      }
    })
  }

  const handleConfirmar = async () => {
    if (productosDistintos === 0) return setError('Debes seleccionar al menos un producto')
    if (!horarioSeleccionado) return setError('Debes seleccionar un horario de recolección')

    try {
      const contadorRef = doc(db, 'config', 'contador')
      const nuevoTurnoRef = doc(collection(db, 'turnos'))
      let numeroTurno

      await runTransaction(db, async (transaction) => {
        const contadorDoc = await transaction.get(contadorRef)
        numeroTurno = contadorDoc.data().ultimo + 1
        transaction.update(contadorRef, { ultimo: numeroTurno })
        transaction.set(nuevoTurnoRef, {
          turno: numeroTurno,
          items: Object.entries(carrito).map(([id, itemData]) => {
            const item = todosLosItems.find(i => i.id === parseInt(id))
            return { nombre: item.nombre, cantidad: itemData.cantidad, precio: item.precio, nota: itemData.nota || '' }
          }),
          total,
          estado: 'en_preparacion',
          horarioRecoleccion: horarioSeleccionado,
          clienteId: clienteId,
          creadoEn: serverTimestamp()
        })
      })

      // Ludificación: Evaluar logros
      const nuevasMedallasAdquiridas = []
      const hoyStr = new Date().toLocaleDateString()

      // 1. Planificador Estrella
      const ahora = new Date()
      const [selHora, selMin] = horarioSeleccionado.split(':').map(Number)
      const horaSeleccionadaObj = new Date()
      horaSeleccionadaObj.setHours(selHora, selMin, 0, 0)
      const difMinutos = (horaSeleccionadaObj.getTime() - ahora.getTime()) / (60 * 1000)

      if (difMinutos >= 30) {
        nuevasMedallasAdquiridas.push({
          tipo: 'Planificador Estrella',
          descripcion: `Pedido para las ${horarioSeleccionado} con anticipación`,
          fecha: hoyStr
        })
      }

      // 2. Desayuno de Campeones
      const tieneDesayuno = Object.keys(carrito).some(id => {
        const itemId = parseInt(id)
        return itemId >= 9 && itemId <= 12
      })
      if (tieneDesayuno) {
        nuevasMedallasAdquiridas.push({
          tipo: 'Desayuno de Campeones',
          descripcion: 'Pediste un desayuno para iniciar el día con energía',
          fecha: hoyStr
        })
      }

      // 3. Gran Banquete
      if (total >= 100) {
        nuevasMedallasAdquiridas.push({
          tipo: 'Gran Banquete',
          descripcion: 'Hiciste un pedido de $100 o más',
          fecha: hoyStr
        })
      }

      // 4. Cliente VIP (3 o más pedidos en el historial, incluyendo el actual)
      if (historialList.length + 1 >= 3) {
        nuevasMedallasAdquiridas.push({
          tipo: 'Cliente VIP',
          descripcion: '¡Tu tercer pedido en la cafetería! Gracias por tu lealtad',
          fecha: hoyStr
        })
      }

      // Sincronizar las medallas en Firestore (evitando duplicados del mismo tipo)
      let nuevasMedallasParaGuardar = [...medallasList]
      let seDesbloqueoNueva = false
      let ultimoLogroLocal = null

      nuevasMedallasAdquiridas.forEach(nueva => {
        const yaTiene = medallasList.some(m => m.tipo === nueva.tipo)
        if (!yaTiene) {
          nuevasMedallasParaGuardar.push(nueva)
          seDesbloqueoNueva = true
          ultimoLogroLocal = nueva
        }
      })

      if (seDesbloqueoNueva) {
        await setDoc(doc(db, 'clientes', clienteId), {
          medallas: nuevasMedallasParaGuardar
        }, { merge: true })

        if (ultimoLogroLocal) {
          localStorage.setItem('ultimoLogro', JSON.stringify(ultimoLogroLocal))
        }
      } else {
        localStorage.removeItem('ultimoLogro')
      }

      // Guardar sesión activa en localStorage (para restaurar en refresh)
      localStorage.setItem('turnoActivoId', nuevoTurnoRef.id)
      localStorage.setItem('turnoActivoNumero', numeroTurno.toString())

      setNumeroTurno(numeroTurno)
      setTurnoId(nuevoTurnoRef.id)
      setConfirmado(true)
      setMostrarConfirmacion(false)
    } catch (_e) {
      setError('Error al generar turno, intenta de nuevo')
    }
  }

  const handleCancelar = () => {
    setCarrito({})
    setConfirmado(false)
    setHorarioSeleccionado('')
    setError('')
    localStorage.removeItem('turnoActivoId')
    localStorage.removeItem('turnoActivoNumero')
  }

  const reordenarPedido = (ped) => {
    const nuevoCarrito = {}
    let itemsExcedidos = false
    let totalItemsCount = 0

    ped.items.forEach(pedItem => {
      const originalItem = todosLosItems.find(i => i.nombre === pedItem.nombre)
      if (originalItem) {
        const cant = Math.min(pedItem.cantidad, 2)
        if (totalItemsCount + cant <= 5) {
          nuevoCarrito[originalItem.id] = { cantidad: cant, nota: pedItem.nota || '' }
          totalItemsCount += cant
        } else {
          itemsExcedidos = true
        }
      }
    })

    setCarrito(nuevoCarrito)
    if (itemsExcedidos) {
      setError('Algunos productos no se pudieron reordenar por el límite de 5 items.')
    } else {
      setError('')
    }
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
                const itemData = carrito[item.id] || { cantidad: 0, nota: '' }
                const cantidad = itemData.cantidad
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
                    
                    {cantidad > 0 && (
                      <div className="mt-3">
                        <label htmlFor={`nota-${item.id}`} className="text-xs font-semibold text-gray-500 dark:text-gray-400 block mb-1">
                          Personalización (opcional):
                        </label>
                        <input
                          id={`nota-${item.id}`}
                          type="text"
                          value={itemData.nota}
                          onChange={(e) => handleNotaChange(item.id, e.target.value)}
                          placeholder="Ej: sin cebolla, aderezo aparte..."
                          className="w-full text-xs border border-gray-300 dark:border-gray-600 rounded-lg px-2.5 py-1.5 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Pestañas de Historial y Medallas */}
      <div className="max-w-2xl mx-auto mt-8 mb-12 bg-white dark:bg-gray-800 rounded-2xl shadow p-5 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4 flex items-center gap-2">
          <span>📜</span> Historial y Logros
        </h2>
        
        <div className="space-y-4">
          {/* Sección Medallas */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Mis Logros (Medallas)</h3>
            {medallasList.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">Aún no has ganado medallas. ¡Pide con 30 minutos de anticipación para desbloquear la primera!</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {medallasList.map((m, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 bg-amber-50 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
                    ⭐ {m.tipo}: {m.descripcion}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Sección Historial */}
          <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Pedidos Anteriores</h3>
            {historialList.length === 0 ? (
              <p className="text-xs text-gray-400 dark:text-gray-500">No tienes pedidos anteriores registrados.</p>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {historialList.slice().reverse().map((ped, idx) => (
                  <div key={idx} className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl border border-gray-100 dark:border-gray-800 text-xs">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-blue-600 dark:text-blue-400">Orden #{ped.turno}</span>
                      <span className="text-gray-500">{ped.fecha} a las {ped.horarioRecoleccion}</span>
                    </div>
                    <ul className="text-gray-600 dark:text-gray-400 mb-2 list-disc list-inside">
                      {ped.items.map((item, i) => (
                        <li key={i}>
                          {item.nombre} x{item.cantidad} {item.nota && `(Nota: "${item.nota}")`}
                        </li>
                      ))}
                    </ul>
                    <div className="flex justify-between items-center font-bold text-gray-700 dark:text-gray-300">
                      <span>Total: ${ped.total}</span>
                      <button 
                        onClick={() => reordenarPedido(ped)}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-905/30 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 rounded font-bold text-xs"
                      >
                        Reordenar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {productosDistintos > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 z-30 shadow-2xl">
          <div className="max-w-2xl mx-auto">
            {/* Selector de horario */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Selecciona horario de recolección:</p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                {obtenerBloquesHorarios().map(hora => {
                  const isSaturated = horariosSaturados.includes(hora)
                  const isSelected = horarioSeleccionado === hora
                  return (
                    <button
                      key={hora}
                      disabled={isSaturated}
                      onClick={() => setHorarioSeleccionado(hora)}
                      className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap border transition-all ${
                        isSelected
                          ? 'bg-blue-400 border-blue-400 text-white shadow-md'
                          : isSaturated
                          ? 'bg-gray-100 border-gray-200 text-gray-600 dark:bg-gray-850 dark:border-gray-700 cursor-not-allowed opacity-50'
                          : 'bg-white border-gray-200 text-gray-700 dark:bg-gray-750 dark:border-gray-600 dark:text-gray-400 hover:border-blue-500'
                      }`}
                    >
                      {hora} {isSaturated && '(Saturado)'}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-200">{productosDistintos} producto(s) seleccionado(s)</p>
                <p className="text-blue-600 dark:text-blue-400 font-bold text-lg">${total}</p>
              </div>
              <button 
                onClick={() => {
                  if (!horarioSeleccionado) {
                    setError('Por favor, selecciona un horario de recolección antes de confirmar.')
                    return
                  }
                  setError('')
                  setMostrarConfirmacion(true)
                }} 
                className="px-6 py-4 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold text-base min-h-44px"
              >
                Confirmar orden
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Pre-confirmación */}
      {mostrarConfirmacion && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" role="dialog" aria-modal="true" aria-labelledby="modal-confirm-title">
            <h2 id="modal-confirm-title" className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">
              Revisar Pedido
            </h2>
            
            <div className="mb-4">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Productos seleccionados</h3>
              <div className="space-y-3">
                {Object.entries(carrito).map(([id, itemData]) => {
                  const item = todosLosItems.find(i => i.id === parseInt(id))
                  return (
                    <div key={id} className="flex justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-2">
                      <div>
                        <p className="font-semibold text-sm text-gray-800 dark:text-gray-100">
                          {item.nombre} <span className="text-blue-600 dark:text-blue-400 font-bold">x{itemData.cantidad}</span>
                        </p>
                        {itemData.nota && (
                          <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                            Nota: "{itemData.nota}"
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-gray-800 dark:text-gray-100">
                        ${item.precio * itemData.cantidad}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">Horario de recolección</h3>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-200 bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900">
                📅 Programado para las {horarioSeleccionado} hrs
              </p>
            </div>

            <div className="flex justify-between items-center mb-6 pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-base font-bold text-gray-800 dark:text-gray-100">Total a pagar</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">${total}</span>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setMostrarConfirmacion(false)}
                className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Modificar
              </button>
              <button
                onClick={handleConfirmar}
                className="flex-1 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-xl font-semibold"
              >
                Confirmar y Enviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ClienteView