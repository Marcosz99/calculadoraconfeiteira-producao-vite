import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPasswordPage from './pages/ResetPasswordPage'
import { useDataMigration } from './hooks/useDataMigration'
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
import RelatoriosAvancadosPage from './pages/RelatoriosAvancadosPage'
import FerramentasPage from './pages/FerramentasPage'
import UpgradePage from './pages/UpgradePage'
import { UpgradePixPage } from './pages/UpgradePixPage'
import HistoricoCalculosPage from './pages/HistoricoCalculosPage'
import CheckoutStripePage from './pages/CheckoutStripePage'
import { UpgradeSuccessPage } from './pages/UpgradeSuccessPage'
import SubscriptionDashboardPage from './pages/SubscriptionDashboardPage'
import ComoUsarPage from './pages/ComoUsarPage'
import MeuCatalogoPage from './pages/MeuCatalogoPage'
import CatalogoPublicoPage from './pages/CatalogoPublicoPage'
import EncomendasPage from './pages/EncomendasPage'
import ComunidadePage from './pages/ComunidadePage'
import BackupEmergencialPage from './pages/BackupEmergencialPage'
{/* Removed CreditTestPage for production */}
import AiAssistantPage from './pages/AiAssistantPage'
import MarketplacePage from './pages/MarketplacePage'
import AdvancedCalculatorPage from './pages/AdvancedCalculatorPage'
import CustomCatalogPage from './pages/CustomCatalogPage'
import FinanceiroPage from './pages/FinanceiroPage'
import PerfilPage from './pages/PerfilPage'
{/* Removed ResetPlanButton for production */}

function AppContent() {
  // Data migration is now disabled as system is fully cloud-based
  // useDataMigration();
  
  return (
    <div className="w-full min-h-screen bg-background text-foreground">
      <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/checkout" element={<CheckoutStripePage />} />
            <Route path="/historico-calculos" element={<ProtectedRoute><HistoricoCalculosPage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute requiresPro={true}><DashboardSimplePage /></ProtectedRoute>} />
            <Route path="/calculadora" element={<ProtectedRoute requiresPro={true}><CalculadoraPage /></ProtectedRoute>} />
            <Route path="/receitas" element={<ProtectedRoute requiresPro={true}><ReceitasPage /></ProtectedRoute>} />
            <Route path="/ingredientes" element={<ProtectedRoute requiresPro={true}><IngredientesPage /></ProtectedRoute>} />
            <Route path="/clientes" element={<ProtectedRoute requiresPro={true}><ClientesPage /></ProtectedRoute>} />
            <Route path="/orcamentos" element={<ProtectedRoute requiresPro={true}><OrcamentosPage /></ProtectedRoute>} />
            <Route path="/relatorios-avancados" element={<ProtectedRoute requiresPro={true}><RelatoriosAvancadosPage /></ProtectedRoute>} />
            <Route path="/ferramentas" element={<ProtectedRoute><FerramentasPage /></ProtectedRoute>} />
            <Route path="/upgrade" element={<ProtectedRoute><UpgradePage /></ProtectedRoute>} />
            <Route path="/upgrade/pix" element={<ProtectedRoute><UpgradePixPage /></ProtectedRoute>} />
            <Route path="/upgrade-success" element={<ProtectedRoute><UpgradeSuccessPage /></ProtectedRoute>} />
            <Route path="/subscription" element={<ProtectedRoute><SubscriptionDashboardPage /></ProtectedRoute>} />
            <Route path="/como-usar" element={<ProtectedRoute><ComoUsarPage /></ProtectedRoute>} />
            <Route path="/meu-catalogo" element={<ProtectedRoute requiresPro={true}><MeuCatalogoPage /></ProtectedRoute>} />
            <Route path="/catalogo/:userId" element={<CatalogoPublicoPage />} />
            <Route path="/encomendas" element={<ProtectedRoute requiresPro={true}><EncomendasPage /></ProtectedRoute>} />
            <Route path="/comunidade" element={<ProtectedRoute><ComunidadePage /></ProtectedRoute>} />
            <Route path="/backup-emergencial" element={<ProtectedRoute requiresPro={true}><BackupEmergencialPage /></ProtectedRoute>} />
            {/* Removed credit test route for production */}
            <Route path="/ai-assistant" element={<ProtectedRoute><AiAssistantPage /></ProtectedRoute>} />
            <Route path="/marketplace" element={<ProtectedRoute requiresPro={true}><MarketplacePage /></ProtectedRoute>} />
            <Route path="/advanced-calculator" element={<ProtectedRoute requiresPro={true}><AdvancedCalculatorPage /></ProtectedRoute>} />
            <Route path="/custom-catalog" element={<ProtectedRoute requiresPro={true}><CustomCatalogPage /></ProtectedRoute>} />
            <Route path="/financeiro" element={<ProtectedRoute requiresPro={true}><FinanceiroPage /></ProtectedRoute>} />
            <Route path="/perfil" element={<ProtectedRoute><PerfilPage /></ProtectedRoute>} />
      </Routes>
      
      {/* Removed ResetPlanButton for production */}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App