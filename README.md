# Turnos de Cafetería

Este es un sistema digital de pedidos y turnos para una cafetería universitaria. Con esto se busca reemplazar el sistema de filas y pedidos en voz alta por un acceso digital en el cual el cliente selecciona su pedido desde su dispositivo, recibe un número de orden y es notificado en tiempo real cuando su pedido está listo.

## Materia y equipo

- **Materia:** Desarrollo y Evaluación de Interfaces
- **Profesor:** Pedro César Santana Mancilla
- **Institución:** Universidad de Colima
- **Integrantes:**
  - Andrea Jocelinne Lopez Vargas
  - Jose Enrique Toledo Olivera
  - Joaquin Munir Esteban Ramirez
  - Esteban Humberto Casian Meneses
  - Eli Sebastian Moreno Razo

## Tecnologías utilizadas

| Tecnología | Versión | Uso |
| React | 18 | Interfaz de usuario |
| Vite | 5 | Bundler y servidor de desarrollo |
| Tailwind CSS | 4 | Estilos y diseño responsivo |
| Firebase Firestore | 10 | Base de datos en tiempo real |
| Firebase Authentication | 10 | Autenticación del administrador |
| Firebase Cloud Messaging | 10 | Notificaciones push |
| React Router DOM | 6 | Navegación entre vistas |
| Vite Plugin PWA | — | Configuración de PWA |
| Node.js + Express | 22 / 4 | Servidor de notificaciones |
| Firebase Admin SDK | 12 | Envío de notificaciones desde servidor |

## Instalación y ejecución local

```bash
# Clonar el repositorio
git clone https://github.com/aVargas-softEng/cafeteria-turnos.git
cd cafeteria-turnos

# Instalar dependencias del frontend
npm install

# Ejecutar en desarrollo
npm run dev
```

Para ejecutar el servidor de notificaciones localmente:

```bash
cd server
npm install

# Crear variable de entorno con las credenciales de Firebase Admin
# Crear archivo .env con:
# FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

node index.js
```

## Prototipo funcional

- **Vista cliente:** https://cafeteria-turnos.vercel.app
- **Panel de administración:** https://cafeteria-turnos.vercel.app/admin
  - Credenciales de acceso: `admin@a.com`

## Funcionalidades implementadas

- Menú digital organizado por categorías (Orden del día, Tortas, Tacos, Bebidas)
- Carrito con límite de 5 productos distintos y máximo 2 unidades por producto
- Generación de número de orden único y correlativo por pedido
- Panel de administración protegido con autenticación por correo y contraseña
- Visualización simultánea de todos los pedidos activos en el panel admin
- Cambio de estado de pedido: de "en preparación" a "listo" o "cancelado"
- Notificación en pantalla en tiempo real cuando el pedido cambia de estado
- Notificaciones push en dispositivos móviles al marcar pedido como listo o cancelado
- Diseño responsivo adaptado a móvil, tablet y escritorio
- Configuración PWA: instalable desde navegador móvil

## Cómo instalar la PWA en tu dispositivo

**Android (Chrome):**
1. Abre https://cafeteria-turnos.vercel.app en Chrome
2. Toca el menú (tres puntos) -> "Agregar a pantalla de inicio"

**iOS (Safari):**
1. Abre https://cafeteria-turnos.vercel.app en Safari
2. Toca el botón de compartir -> "Agregar a pantalla de inicio"

## Uso de inteligencia artificial

Se utilizó **Claude (Anthropic)** como herramienta de apoyo durante el desarrollo del proyecto.

- **Herramienta:** Claude Sonnet — claude.ai
- **Tareas apoyadas por IA:**
  - Configuración de Tailwind CSS con el plugin para Vite
  - Integración de Firebase Firestore y Cloud Messaging
  - Implementación de la lógica de transacciones para generación de turnos
  - Configuración del servidor Node.js con Firebase Admin SDK
  - Resolución de errores durante el desarrollo y despliegue
  - Configuración de PWA con vite-plugin-pwa
- **Partes del proyecto apoyadas por IA:** Configuración inicial, integración con Firebase, servidor de notificaciones
- **Revisión del equipo:** Todo el código generado fue revisado, probado, ajustado e integrado por el equipo. Los integrantes comprenden el funcionamiento de cada componente del sistema.
- **Enlace a la conversación:** https://claude.ai/share/9cffc771-bd0d-46ea-ba1c-0c1bbccebf41

## Licencia
MIT
