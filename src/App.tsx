import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import DashboardPage from './pages/DashboardPage'
import CalculadoraPage from './pages/CalculadoraPage'
import ReceitasPage from './pages/ReceitasPage'
import IngredientesPage from './pages/IngredientesPage'
import ClientesPage from './pages/ClientesPage'
import OrcamentosPage from './pages/OrcamentosPage'
import RelatoriosPage from './pages/RelatoriosPage'
import UpgradePage from './pages/UpgradePage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import './App.css'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/calculadora" element={<CalculadoraPage />} />
            <Route path="/receitas" element={<ReceitasPage />} />
            <Route path="/ingredientes" element={<IngredientesPage />} />
            <Route path="/clientes" element={<ClientesPage />} />
            <Route path="/orcamentos" element={<OrcamentosPage />} />
            <Route path="/relatorios" element={<RelatoriosPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App