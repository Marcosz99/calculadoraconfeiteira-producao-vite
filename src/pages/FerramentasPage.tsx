import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Calculator, Scale, Tag, ShoppingCart, FileText, Download } from 'lucide-react'

export default function FerramentasPage() {
  const [conversorTab, setConversorTab] = useState('volume')
  const [etiquetaData, setEtiquetaData] = useState({
    nome_produto: '',
    preco: 0,
    data_validade: '',
    ingredientes: ''
  })
  
  // Estados para conversores
  const [volumeInput, setVolumeInput] = useState({ valor: 0, unidade: 'ml' })
  const [pesoInput, setPesoInput] = useState({ valor: 0, unidade: 'g' })
  
  // Conversões de volume
  const conversoesVolume = {
    ml: 1,
    l: 1000,
    'xícara': 240,
    'colher-sopa': 15,
    'colher-chá': 5
  }
  
  // Conversões de peso
  const conversoesPeso = {
    g: 1,
    kg: 1000,
    'xícara-açúcar': 200,
    'xícara-farinha': 120,
    'colher-sopa-açúcar': 12,
    'colher-chá-açúcar': 4
  }
  
  const converterVolume = (valor: number, deUnidade: string, paraUnidade: string) => {
    const valorEmMl = valor * conversoesVolume[deUnidade as keyof typeof conversoesVolume]
    return valorEmMl / conversoesVolume[paraUnidade as keyof typeof conversoesVolume]
  }
  
  const converterPeso = (valor: number, deUnidade: string, paraUnidade: string) => {
    const valorEmG = valor * conversoesPeso[deUnidade as keyof typeof conversoesPeso]
    return valorEmG / conversoesPeso[paraUnidade as keyof typeof conversoesPeso]
  }
  
  const gerarEtiqueta = () => {
    const etiquetaHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Etiqueta - ${etiquetaData.nome_produto}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
        }
        .etiqueta {
            width: 10cm;
            height: 6cm;
            border: 2px solid #333;
            padding: 10px;
            margin: 10px;
            display: inline-block;
            position: relative;
            background: white;
        }
        .produto-nome {
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            margin-bottom: 10px;
        }
        .preco {
            font-size: 24px;
            font-weight: bold;
            color: #d63384;
            text-align: center;
            margin: 10px 0;
        }
        .validade {
            font-size: 12px;
            margin: 5px 0;
        }
        .ingredientes {
            font-size: 10px;
            margin-top: 10px;
            line-height: 1.2;
        }
        .rodape {
            position: absolute;
            bottom: 5px;
            right: 10px;
            font-size: 8px;
            color: #666;
        }
        @media print {
            body { margin: 0; padding: 0; }
            .etiqueta { margin: 0; }
        }
    </style>
</head>
<body>
    <div class="etiqueta">
        <div class="produto-nome">${etiquetaData.nome_produto}</div>
        <div class="preco">R$ ${etiquetaData.preco.toFixed(2)}</div>
        ${etiquetaData.data_validade ? `<div class="validade">Validade: ${new Date(etiquetaData.data_validade).toLocaleDateString('pt-BR')}</div>` : ''}
        ${etiquetaData.ingredientes ? `<div class="ingredientes">Ingredientes: ${etiquetaData.ingredientes}</div>` : ''}
        <div class="rodape">DoceCalc</div>
    </div>
    <script>
        window.onload = function() {
            window.print();
        }
    </script>
</body>
</html>
    `
    
    const blob = new Blob([etiquetaHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const newWindow = window.open(url, '_blank')
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 1000)
      }
    }
  }
  
  const gerarListaCompras = () => {
    const ingredientesBasicos = [
      'Açúcar cristal - 1kg',
      'Farinha de trigo - 1kg',
      'Ovos - 1 dúzia',
      'Manteiga - 500g',
      'Leite integral - 1L',
      'Fermento em pó - 100g',
      'Essência de baunilha - 30ml',
      'Chocolate em pó - 200g'
    ]
    
    const listaHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Lista de Compras - DoceCalc</title>
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        h1 { color: #d63384; text-align: center; }
        .item { 
            padding: 10px; 
            border-bottom: 1px dashed #ccc; 
            display: flex; 
            align-items: center; 
        }
        .checkbox { 
            width: 20px; 
            height: 20px; 
            border: 2px solid #333; 
            margin-right: 15px; 
        }
        .rodape { 
            margin-top: 30px; 
            text-align: center; 
            color: #666; 
            font-size: 12px; 
        }
    </style>
</head>
<body>
    <h1>📝 Lista de Compras</h1>
    <p><strong>Data:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
    ${ingredientesBasicos.map(item => `
        <div class="item">
            <div class="checkbox"></div>
            <span>${item}</span>
        </div>
    `).join('')}
    <div class="rodape">
        <p>Gerado pelo DoceCalc - Calculadora para Confeiteiras</p>
    </div>
</body>
</html>
    `
    
    const blob = new Blob([listaHtml], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const newWindow = window.open(url, '_blank')
    
    if (newWindow) {
      newWindow.onload = () => {
        setTimeout(() => {
          URL.revokeObjectURL(url)
        }, 1000)
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center space-x-4">
          <Link 
            to="/dashboard"
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Ferramentas Auxiliares
            </h1>
            <p className="text-gray-600">
              Conversores, etiquetas e outras ferramentas úteis
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Conversores de Medidas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Scale className="h-6 w-6 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-900">Conversor de Medidas</h2>
            </div>
            
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setConversorTab('volume')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  conversorTab === 'volume' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Volume
              </button>
              <button
                onClick={() => setConversorTab('peso')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  conversorTab === 'peso' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                Peso
              </button>
            </div>

            {conversorTab === 'volume' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor
                    </label>
                    <input
                      type="number"
                      value={volumeInput.valor}
                      onChange={(e) => setVolumeInput({...volumeInput, valor: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade
                    </label>
                    <select
                      value={volumeInput.unidade}
                      onChange={(e) => setVolumeInput({...volumeInput, unidade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ml">Mililitros (ml)</option>
                      <option value="l">Litros (l)</option>
                      <option value="xícara">Xícara</option>
                      <option value="colher-sopa">Colher de sopa</option>
                      <option value="colher-chá">Colher de chá</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Conversões:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.keys(conversoesVolume).filter(u => u !== volumeInput.unidade).map(unidade => (
                      <div key={unidade} className="flex justify-between">
                        <span>{unidade}:</span>
                        <span className="font-medium">
                          {converterVolume(volumeInput.valor, volumeInput.unidade, unidade).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {conversorTab === 'peso' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Valor
                    </label>
                    <input
                      type="number"
                      value={pesoInput.valor}
                      onChange={(e) => setPesoInput({...pesoInput, valor: parseFloat(e.target.value) || 0})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Unidade
                    </label>
                    <select
                      value={pesoInput.unidade}
                      onChange={(e) => setPesoInput({...pesoInput, unidade: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="g">Gramas (g)</option>
                      <option value="kg">Quilos (kg)</option>
                      <option value="xícara-açúcar">Xícara de açúcar</option>
                      <option value="xícara-farinha">Xícara de farinha</option>
                      <option value="colher-sopa-açúcar">Colher sopa açúcar</option>
                      <option value="colher-chá-açúcar">Colher chá açúcar</option>
                    </select>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">Conversões:</h4>
                  <div className="space-y-1 text-sm">
                    {Object.keys(conversoesPeso).filter(u => u !== pesoInput.unidade).map(unidade => (
                      <div key={unidade} className="flex justify-between">
                        <span>{unidade}:</span>
                        <span className="font-medium">
                          {converterPeso(pesoInput.valor, pesoInput.unidade, unidade).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Gerador de Etiquetas */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Tag className="h-6 w-6 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-900">Gerador de Etiquetas</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={etiquetaData.nome_produto}
                  onChange={(e) => setEtiquetaData({...etiquetaData, nome_produto: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Ex: Bolo de Chocolate"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preço (R$) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={etiquetaData.preco}
                  onChange={(e) => setEtiquetaData({...etiquetaData, preco: parseFloat(e.target.value) || 0})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Validade
                </label>
                <input
                  type="date"
                  value={etiquetaData.data_validade}
                  onChange={(e) => setEtiquetaData({...etiquetaData, data_validade: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ingredientes
                </label>
                <textarea
                  value={etiquetaData.ingredientes}
                  onChange={(e) => setEtiquetaData({...etiquetaData, ingredientes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  rows={3}
                  placeholder="Lista de ingredientes separados por vírgula"
                />
              </div>
              
              <button
                onClick={gerarEtiqueta}
                disabled={!etiquetaData.nome_produto || etiquetaData.preco <= 0}
                className="w-full bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <Tag className="h-5 w-5" />
                <span>Gerar Etiqueta</span>
              </button>
            </div>
          </div>
          
          {/* Lista de Compras */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <ShoppingCart className="h-6 w-6 text-purple-500" />
              <h2 className="text-xl font-semibold text-gray-900">Lista de Compras</h2>
            </div>
            
            <p className="text-gray-600 mb-6">
              Gere uma lista de compras com ingredientes básicos para confeitaria.
            </p>
            
            <button
              onClick={gerarListaCompras}
              className="w-full bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span>Gerar Lista de Compras</span>
            </button>
          </div>
          
          {/* Calculadora Nutricional Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Calculator className="h-6 w-6 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-900">Calculadora Nutricional</h2>
            </div>
            
            <div className="text-center py-8">
              <Calculator className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Em Desenvolvimento
              </h3>
              <p className="text-gray-500 mb-4">
                Esta funcionalidade estará disponível em breve para calcular informações nutricionais dos seus produtos.
              </p>
              <div className="bg-orange-50 p-4 rounded-lg">
                <p className="text-sm text-orange-700">
                  💡 <strong>Prévia:</strong> Calcule calorias, carboidratos, proteínas e gorduras automaticamente com base nos ingredientes das suas receitas.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Dicas */}
        <div className="bg-blue-50 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">💡 Dicas de Uso</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Conversores</h4>
              <p className="text-sm text-blue-700">
                Use os conversores para adaptar receitas de outros países ou quando não tiver as medidas exatas.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-800 mb-2">Etiquetas</h4>
              <p className="text-sm text-blue-700">
                Crie etiquetas profissionais para seus produtos. Inclua sempre os ingredientes para clientes com alergias.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}