import { messaging } from './config'
import { getToken, onMessage } from 'firebase/messaging'

const VAPID_KEY = 'BKrUe-jGMj7RNpHYEzTVnlQWx9ie3M5ICoJV_qDXbVrmVMRlNez47kmI27_2UQFEG21DUpu1LNdfSL4aqBAsZTA'

export const solicitarPermiso = async () => {
  try {
    const permiso = await Notification.requestPermission()
    if (permiso !== 'granted') return null

    const token = await getToken(messaging, { vapidKey: VAPID_KEY })
    return token
  } catch (e) {
    console.error('Error al obtener token:', e)
    return null
  }
}

export const escucharNotificaciones = (callback) => {
  onMessage(messaging, (payload) => {
    callback(payload)
  })
}