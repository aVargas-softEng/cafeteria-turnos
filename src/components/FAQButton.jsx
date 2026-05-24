import { useState } from 'react'

const faqs = [
  {
    pregunta: '¿Cómo hago mi pedido?',
    respuesta: 'Selecciona los productos que deseas del menú, agrégalos con el botón +, y presiona "Confirmar orden" en la barra inferior.'
  },
  {
    pregunta: '¿Cómo sé cuándo está listo mi pedido?',
    respuesta: 'Recibirás una notificación en tu dispositivo y la pantalla cambiará automáticamente cuando tu orden esté lista.'
  },
  {
    pregunta: '¿Cuántos productos puedo pedir?',
    respuesta: 'Puedes seleccionar máximo 5 productos distintos y hasta 2 unidades de cada uno.'
  },
  {
    pregunta: '¿Dónde pago?',
    respuesta: 'El pago se realiza en ventanilla al momento de recoger tu pedido.'
  },
  {
    pregunta: '¿Puedo cancelar mi pedido?',
    respuesta: 'No es posible cancelar desde la app. Si necesitas cancelar, acércate al personal de la cafetería.'
  },
]

function FAQButton() {
  const [abierto, setAbierto] = useState(false)
  const [itemAbierto, setItemAbierto] = useState(null)

  return (
    <>
      {abierto && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
          onClick={() => setAbierto(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-5 w-11/12 max-w-md max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
                Preguntas frecuentes
              </h2>
              <button
                onClick={() => setAbierto(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-100 text-xl font-bold"
                aria-label="Cerrar ayuda"
              >
                ✕
              </button>
            </div>

            {faqs.map((faq, i) => (
              <div key={i} className="mb-2 border-b border-gray-100 dark:border-gray-700 pb-2">
                <button
                  onClick={() => setItemAbierto(itemAbierto === i ? null : i)}
                  className="w-full text-left text-sm font-medium text-gray-700 dark:text-gray-200 py-1"
                  aria-expanded={itemAbierto === i}
                >
                  {itemAbierto === i ? '▲' : '▼'} {faq.pregunta}
                </button>
                {itemAbierto === i && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 pl-4">
                    {faq.respuesta}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={() => setAbierto(!abierto)}
        className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow"
        aria-label="Ayuda y preguntas frecuentes"
      >
        ❓
      </button>
    </>
  )
}

export default FAQButton