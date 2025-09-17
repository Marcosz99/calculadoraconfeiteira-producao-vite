# DoceCalc - Calculadora de Preços para Confeiteiras

## Overview

DoceCalc is a comprehensive pricing calculator application designed specifically for confectionery businesses. The platform helps confectioners calculate accurate prices for their recipes, manage ingredients, track costs, and maintain profitability. It includes features for recipe management, ingredient databases, budget calculations, and business analytics with both free and pro subscription tiers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: Vite + React 18 for fast development and optimized builds
- **UI Components**: Tailwind CSS for styling with responsive design
- **State Management**: React Context API for auth state, localStorage for data persistence
- **Form Handling**: React Hook Form with Zod validation for type-safe form management
- **Icons**: Lucide React for consistent iconography throughout the application
- **Routing**: React Router DOM for client-side navigation

### Authentication & Authorization
- **Authentication Provider**: Simple localStorage-based auth for demo purposes
- **Session Management**: React Context with localStorage persistence
- **User Context**: AuthProvider component using React Router navigation
- **Protected Routes**: TODO - can be implemented with React Router guards
- **Note**: Current auth is demo-only, production should use Supabase/Firebase

### Backend Architecture
- **Database**: localStorage with mock data for demo
- **API Layer**: TODO - removed, use Supabase/Firebase for production
- **File Storage**: TODO - removed, implement cloud storage when needed
- **Real-time Updates**: TODO - removed, add WebSocket/SSE for production

### Data Architecture
- **User Profiles**: Stored in localStorage with basic user info
- **Recipe Management**: Mock data structure ready for backend integration
- **Ingredient Database**: Sample ingredients with pricing in localStorage
- **Calculation Engine**: Frontend-only pricing calculations
- **Budget System**: TODO - implement when backend is added

### Key Features
- **Pricing Calculator**: Advanced algorithm considering ingredient costs, labor time, complexity multipliers, and overhead expenses
- **Recipe Management**: Create, edit, and organize recipes with detailed ingredient lists and instructions
- **Ingredient Database**: Maintain current pricing for ingredients with category organization
- **Business Analytics**: Dashboard with key metrics and performance indicators
- **Multi-tier Pricing**: Free and Pro plans with feature differentiation

## External Dependencies

### Core Services
- **Replit**: Development and hosting platform
- **localStorage**: Client-side data persistence for demo

### UI & Design
- **Tailwind CSS**: Utility-first CSS framework for styling and responsive design
- **Lucide React**: Icon library for consistent visual elements

### Development Tools
- **Vite**: Fast build tool and dev server
- **TypeScript**: Type safety and enhanced development experience
- **ESLint**: Code linting and style enforcement
- **PostCSS & Autoprefixer**: CSS processing and browser compatibility

### Form & Validation
- **React Hook Form**: Efficient form handling and validation
- **Zod**: Schema validation for form data and API responses

### Utility Libraries
- **clsx & tailwind-merge**: Dynamic CSS class management
- **class-variance-authority**: Type-safe component variant handling
- **React Router DOM**: Client-side routing

## Migration Notes (Sept 2025)

### Removed Dependencies
- **Next.js**: Migrated to Vite for simpler development
- **Supabase**: Removed heavy backend dependencies
- **Stripe**: Payment processing removed for demo
- **PostgreSQL/Drizzle**: Database replaced with localStorage
- **bcryptjs/JWT**: Complex auth replaced with simple demo auth

### Archived Files
All Next.js related files moved to `archived-nextjs/` folder:
- App Router pages and API routes
- Server-side components and middleware
- Database schemas and auth providers
- Payment integration code

### Current Status
- ✅ 100% functional Vite + React application
- ✅ Clean build pipeline (npm run build works)
- ✅ Simple demo authentication
- ✅ Calculator and dashboard pages working
- ✅ Mock data for development
- 🔄 Ready for backend integration when needed