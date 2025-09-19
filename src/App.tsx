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
import { UpgradePixPage } from './pages/UpgradePixPage'
import { UpgradeStripePage } from './pages/UpgradeStripePage'
import ComunidadePage from './pages/ComunidadePage'
import BackupEmergencialPage from './pages/BackupEmergencialPage'
import LandingPage from './pages/LandingPage'
import FerramentasPage from './pages/FerramentasPage'
import LoginPage from './pages/LoginPage'
import MeuCatalogoPage from './pages/MeuCatalogoPage'
import EncomendasPage from './pages/EncomendasPage'
import CatalogoPublicoPage from './pages/CatalogoPublicoPage'
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
            <Route path="/ferramentas" element={<FerramentasPage />} />
            <Route path="/upgrade" element={<UpgradePage />} />
            <Route path="/upgrade/pix" element={<UpgradePixPage />} />
            <Route path="/upgrade/stripe" element={<UpgradeStripePage />} />
            <Route path="/comunidade" element={<ComunidadePage />} />
            <Route path="/backup-emergencial" element={<BackupEmergencialPage />} />
            <Route path="/meu-catalogo" element={<MeuCatalogoPage />} />
            <Route path="/encomendas" element={<EncomendasPage />} />
            <Route path="/catalogo/:userId" element={<CatalogoPublicoPage />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App