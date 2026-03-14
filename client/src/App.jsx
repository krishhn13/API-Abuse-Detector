import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import IPManagement from './pages/IPManagement'
import Alerts from './pages/Alerts'
import Rules from './pages/Rules'
import Logs from './pages/Logs'

function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <div className="main-content">
          <Header />
          <main className="page-content">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/ips" element={<IPManagement />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/rules" element={<Rules />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
