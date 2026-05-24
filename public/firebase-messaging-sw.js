/* eslint-disable */
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.0.0/firebase-messaging-compat.js')

firebase.initializeApp({
  apiKey: "AIzaSyB-Jm86DQuY8Om8LAtu-emi6j6bO9CMpHk",
  authDomain: "coffeeturns-udc.firebaseapp.com",
  projectId: "coffeeturns-udc",
  storageBucket: "coffeeturns-udc.firebasestorage.app",
  messagingSenderId: "404054899818",
  appId: "1:404054899818:web:046ffe44ef648580359e13"
})

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
    icon: '/icon.png'
  })
})