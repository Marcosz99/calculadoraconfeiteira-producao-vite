import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import DashboardPage from './pages/DashboardPage'
import CalculadoraPage from './pages/CalculadoraPage'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculadora" element={<CalculadoraPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App