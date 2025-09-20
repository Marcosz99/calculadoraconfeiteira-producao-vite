import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPasswordPage from './pages/ResetPasswordPage'
import './App.css'

// Páginas
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import DashboardSimplePage from './pages/DashboardSimplePage'
import CalculadoraPage from './pages/CalculadoraPage'
import ReceitasPage from './pages/ReceitasPage'
import IngredientesPage from './pages/IngredientesPage'
import ClientesPage from './pages/ClientesPage'
import OrcamentosPage from './pages/OrcamentosPage'
import RelatoriosPage from './pages/RelatoriosPage'
import FerramentasPage from './pages/FerramentasPage'
import UpgradePage from './pages/UpgradePage'
import { UpgradePixPage } from './pages/UpgradePixPage'
import { UpgradeStripePage } from './pages/UpgradeStripePage'
import { UpgradeSuccessPage } from './pages/UpgradeSuccessPage'
import SubscriptionDashboardPage from './pages/SubscriptionDashboardPage'
import ComoUsarPage from './pages/ComoUsarPage'
import MeuCatalogoPage from './pages/MeuCatalogoPage'
import CatalogoPublicoPage from './pages/CatalogoPublicoPage'
import EncomendasPage from './pages/EncomendasPage'
import ComunidadePage from './pages/ComunidadePage'
import BackupEmergencialPage from './pages/BackupEmergencialPage'
import CreditTestPage from './pages/CreditTestPage'
import { ResetPlanButton } from './components/ResetPlanButton'

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="w-full min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardSimplePage /></ProtectedRoute>} />
            <Route path="/calculadora" element={<ProtectedRoute><CalculadoraPage /></ProtectedRoute>} />
            <Route path="/receitas" element={<ProtectedRoute><ReceitasPage /></ProtectedRoute>} />
            <Route path="/ingredientes" element={<ProtectedRoute><IngredientesPage /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute><ClientesPage /></ProtectedRoute>} />
            <Route path="/orcamentos" element={<ProtectedRoute><OrcamentosPage /></ProtectedRoute>} />
            <Route path="/relatorios" element={<ProtectedRoute requiresPro={true}><RelatoriosPage /></ProtectedRoute>} />
            <Route path="/ferramentas" element={<ProtectedRoute><FerramentasPage /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            <Route path="/upgrade/pix" element={<ProtectedRoute><UpgradePixPage /></ProtectedRoute>} />
            <Route path="/upgrade/stripe" element={<ProtectedRoute><UpgradeStripePage /></ProtectedRoute>} />
            <Route path="/upgrade-success" element={<ProtectedRoute><UpgradeSuccessPage /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionDashboardPage /></ProtectedRoute>} />
            <Route path="/como-usar" element={<ProtectedRoute><ComoUsarPage /></ProtectedRoute>} />
            <Route path="/meu-catalogo" element={<ProtectedRoute><MeuCatalogoPage /></ProtectedRoute>} />
            <Route path="/catalogo/:userId" element={<CatalogoPublicoPage />} />
            <Route path="/encomendas" element={<ProtectedRoute><EncomendasPage /></ProtectedRoute>} />
            <Route path="/comunidade" element={<ProtectedRoute><ComunidadePage /></ProtectedRoute>} />
            <Route path="/backup-emergencial" element={<ProtectedRoute><BackupEmergencialPage /></ProtectedRoute>} />
            <Route path="/credit-test" element={<ProtectedRoute><CreditTestPage /></ProtectedRoute>} />
          </Routes>
          
          <ResetPlanButton />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App