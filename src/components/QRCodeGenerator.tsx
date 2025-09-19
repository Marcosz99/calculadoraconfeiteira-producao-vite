import React, { useState, useEffect } from 'react'
import { X, Download, Copy, Share2 } from 'lucide-react'
import QRCode from 'qrcode'

interface QRCodeGeneratorProps {
  url: string
  title: string
  onClose: () => void
  isOpen: boolean
}

export default function QRCodeGenerator({ url, title, onClose, isOpen }: QRCodeGeneratorProps) {
  const [qrCodeData, setQrCodeData] = useState<string>('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && url) {
      generateQRCode()
    }
  }, [isOpen, url])

  const generateQRCode = async () => {
    setLoading(true)
    try {
      const qrData = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        errorCorrectionLevel: 'M'
      })
      setQrCodeData(qrData)
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeData) return
    
    const link = document.createElement('a')
    link.download = `catalogo-qr-${title.replace(/\s+/g, '-').toLowerCase()}.png`
    link.href = qrCodeData
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      alert('Link copiado para a área de transferência!')
    } catch (error) {
      console.error('Erro ao copiar link:', error)
      alert('Erro ao copiar link')
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Catálogo - ${title}`,
          text: `Confira nossos produtos deliciosos!`,
          url: url
        })
      } catch (error) {
        console.error('Erro ao compartilhar:', error)
      }
    } else {
      copyLink()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">QR Code do Catálogo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center mb-6">
          <div className="bg-gray-50 rounded-xl p-6 mb-4">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
              </div>
            ) : qrCodeData ? (
              <img 
                src={qrCodeData} 
                alt="QR Code do Catálogo" 
                className="mx-auto max-w-full h-auto"
              />
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Erro ao gerar QR Code
              </div>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mb-2">
            <strong>{title}</strong>
          </p>
          <p className="text-xs text-gray-500 break-all">
            {url}
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={downloadQRCode}
            disabled={!qrCodeData}
            className="w-full bg-pink-500 text-white py-3 px-4 rounded-lg hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Baixar QR Code</span>
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={copyLink}
              className="bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Copy className="h-4 w-4" />
              <span>Copiar Link</span>
            </button>

            <button
              onClick={shareLink}
              className="bg-blue-100 text-blue-700 py-3 px-4 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center space-x-2"
            >
              <Share2 className="h-4 w-4" />
              <span>Compartilhar</span>
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">💡 Como usar:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Imprima o QR Code e cole no seu estabelecimento</li>
            <li>• Compartilhe nas redes sociais</li>
            <li>• Adicione em cartões de visita</li>
            <li>• Clientes escaneiam e acessam seu catálogo</li>
          </ul>
        </div>
      </div>
    </div>
  )
}