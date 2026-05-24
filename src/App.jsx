import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ClienteView from './views/ClientsView'
import AdminView from './views/AdminView'
import FAQButton from './components/FAQButton'

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  return (
    <BrowserRouter>
      <div className={darkMode ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <div className="fixed top-4 right-4 z-50 flex flex-row gap-2 [@media(max-width:500px)]:flex-col [@media(max-width:500px)]:right-2 [@media(max-width:500px)]:items-center">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 shadow"
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
            <FAQButton />
          </div>
          <Routes>
            <Route path="/" element={<ClienteView />} />
            <Route path="/admin" element={<AdminView />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App