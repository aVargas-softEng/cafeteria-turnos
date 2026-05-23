import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ClienteView from './views/ClientsView'
import AdminView from './views/AdminView'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ClienteView />} />
        <Route path="/admin" element={<AdminView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App