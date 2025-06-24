import { useEffect, useState } from 'react'
import {
  LuBarChart3,
  LuDollarSign,
  LuTrendingUp,
  LuWallet,
} from 'react-icons/lu'
import HomeCard from '../components/home-card'
import { getOverviewData, type OverviewData } from '../services/homeService'

export default function Home() {
  const [data, setData] = useState<OverviewData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const overviewData = await getOverviewData()
        setData(overviewData)
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div id="content">
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Carregando...</div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div id="content">
        <div className="flex items-center justify-center h-64">
          <div className="text-red-500">Erro ao carregar dados</div>
        </div>
      </div>
    )
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const calculateTotalInvestment = (asset: any) => {
    return asset.average_price * asset.quantity
  }

  const calculateCurrentTotal = (asset: any) => {
    return asset.current_price * asset.quantity
  }

  const calculateGainLoss = (asset: any) => {
    return calculateCurrentTotal(asset) - calculateTotalInvestment(asset)
  }

  const calculateGainLossPercentage = (asset: any) => {
    const totalInvestment = calculateTotalInvestment(asset)
    const gainLoss = calculateGainLoss(asset)
    return (gainLoss / totalInvestment) * 100
  }

  return (
    <div id="content">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <HomeCard
          icon={<LuDollarSign className="w-6 h-6 text-emerald-500" />}
          color="emerald"
        >
          <p className="text-sm text-gray-500">Investment</p>
          <p className="text-xl font-semibold">{formatCurrency(data.invested_amount)}</p>
        </HomeCard>

        <HomeCard
          icon={<LuBarChart3 className="w-6 h-6 text-blue-500" />}
          color="blue"
        >
          <p className="text-sm text-gray-500">Current</p>
          <p className="text-xl font-semibold">{formatCurrency(data.current_value)}</p>
        </HomeCard>

        <HomeCard
          icon={<LuTrendingUp className="w-6 h-6 text-red-500" />}
          color="red"
        >
          <p className="text-sm text-gray-500">Earnings</p>
          <p className={`text-xl font-semibold ${(data.current_value - data.invested_amount) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(data.current_value - data.invested_amount)}
            <span className={`pl-1 text-xs align-top ${(data.current_value - data.invested_amount) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ({formatPercentage(((data.current_value - data.invested_amount) / data.invested_amount) * 100)})
            </span>
          </p>
        </HomeCard>

        <HomeCard
          icon={<LuWallet className="w-6 h-6 text-purple-500" />}
          color="purple"
        >
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-xl font-semibold">{formatCurrency(data.available_balance)}</p>
        </HomeCard>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-gray-50 text-xs text-semibold uppercase tracking-tight">
            <tr>
              <th className="px-6 py-3 text-left border-r">Asset</th>
              <th className="px-6 py-3">Average Price</th>
              <th className="px-6 py-3">Quantity</th>
              <th className="px-6 py-3 border-r">Total Investment</th>
              <th className="px-6 py-3">Current Price</th>
              <th className="px-6 py-3 border-r">Current Total</th>
              <th className="px-6 py-3">Gain/Loss</th>
              <th className="px-6 py-3">%</th>
              <th className="px-6 py-3">Type</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.assets.map((asset, index) => {
              const gainLoss = calculateGainLoss(asset)
              const gainLossPercentage = calculateGainLossPercentage(asset)
              const isPositive = gainLoss >= 0

              return (
                <tr key={index.toString()}>
                  <td className="px-6 py-4 whitespace-nowrap border-r">
                    {asset.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {formatCurrency(asset.average_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {asset.quantity.toLocaleString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center border-r">
                    {formatCurrency(calculateTotalInvestment(asset))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    {formatCurrency(asset.current_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center border-r">
                    {formatCurrency(calculateCurrentTotal(asset))}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatCurrency(gainLoss)}
                  </td>
                  <td
                    className={`px-6 py-4 whitespace-nowrap text-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {formatPercentage(gainLossPercentage)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        asset.type === 'stock' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {asset.type.toUpperCase()}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
