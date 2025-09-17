import './globals.css'
import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'
import { LocalAuthProvider } from '@/components/auth/local-auth-provider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'DoceCalc - Calculadora de Preços para Confeiteiras',
  description: 'A ferramenta completa para calcular preços de doces e controlar custos da sua confeitaria. Nunca mais venda no prejuízo!',
  keywords: 'calculadora preços, confeitaria, doces, custos, receitas, margem lucro',
  authors: [{ name: 'DoceCalc Team' }],
  creator: 'DoceCalc',
  publisher: 'DoceCalc',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'DoceCalc - Calculadora de Preços para Confeiteiras',
    description: 'Calcule o preço correto dos seus doces e tenha uma confeitaria lucrativa',
    url: '/',
    siteName: 'DoceCalc',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DoceCalc - Calculadora para Confeiteiras',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DoceCalc - Calculadora de Preços para Confeiteiras',
    description: 'Calcule o preço correto dos seus doces e tenha uma confeitaria lucrativa',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_ID,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body className="min-h-screen bg-gradient-soft font-sans antialiased">
        <LocalAuthProvider>
          {children}
          <Toaster />
        </LocalAuthProvider>
      </body>
    </html>
  )
}
