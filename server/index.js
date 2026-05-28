/* eslint-disable */
const express = require('express')
const admin = require('firebase-admin')

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
})

const db = admin.firestore()
const app = express()

// Escucha cambios en la colección turnos
db.collection('turnos').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach(async (change) => {
    if (change.type === 'modified') {
      const data = change.doc.data()
      const token = data.fcmToken
      const estado = data.estado

      if (!token) return
      if (estado !== 'listo' && estado !== 'cancelado') return

      const mensaje = estado === 'listo'
        ? { 
            title: '¡Tu orden está lista!', 
            body: data.horarioRecoleccion 
              ? `Tu pedido programado para las ${data.horarioRecoleccion} hrs ya está listo. ¡Pasa por él!` 
              : 'Pasa a ventanilla a recoger y pagar tu pedido.' 
          }
        : { title: 'Orden cancelada', body: 'El personal canceló tu pedido.' }

      try {
        await admin.messaging().send({
          token,
          notification: mensaje
        })
        console.log(`Notificación enviada para orden #${data.turno}`)
      } catch (e) {
        console.error('Error enviando notificación:', e.message)
      }
    }
  })
})

app.get('/', (req, res) => res.send('Servidor activo'))

app.listen(process.env.PORT || 3000, () => console.log('Servidor corriendo'))
