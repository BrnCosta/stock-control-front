import {
  LuBarChart3,
  LuDollarSign,
  LuTrendingUp,
  LuWallet,
} from 'react-icons/lu'
import HomeCard from '../components/home-card'

export default function Home() {
  return (
    <div id="content">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <HomeCard
          icon={<LuDollarSign className="w-6 h-6 text-emerald-500" />}
          color="emerald"
        >
          <p className="text-sm text-gray-500">Investment</p>
          <p className="text-xl font-semibold">R$ 25.558,06</p>
        </HomeCard>

        <HomeCard
          icon={<LuBarChart3 className="w-6 h-6 text-blue-500" />}
          color="blue"
        >
          <p className="text-sm text-gray-500">Current</p>
          <p className="text-xl font-semibold">R$ 25.170,70</p>
        </HomeCard>

        <HomeCard
          icon={<LuTrendingUp className="w-6 h-6 text-red-500" />}
          color="red"
        >
          <p className="text-sm text-gray-500">Earnings</p>
          <p className="text-xl font-semibold text-red-500">
            -R$ 387,36
            <span className="pl-1 text-xs align-top">(-1.52%)</span>
          </p>
        </HomeCard>

        <HomeCard
          icon={<LuWallet className="w-6 h-6 text-purple-500" />}
          color="purple"
        >
          <p className="text-sm text-gray-500">Available Balance</p>
          <p className="text-xl font-semibold">R$ 420,00</p>
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
            {[...Array(5)].map((_, index) => (
              <tr key={index.toString()}>
                <td className="px-6 py-4 whitespace-nowrap border-r">
                  {index % 2 === 0 ? 'MGLU3' : 'BRCO11'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  R$ {index % 2 === 0 ? '2,34' : '96,25'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {index % 2 === 0 ? '3000' : '20'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border-r">
                  R$ {index % 2 === 0 ? '7.021,90' : '1.925,01'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  R$ {index % 2 === 0 ? '1,80' : '123,00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center border-r">
                  R$ {index % 2 === 0 ? '5.400,00' : '2.460,00'}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-center ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {index % 2 === 0 ? '-R$ 1.621,90' : 'R$ 534,99'}
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap text-center ${index % 2 === 0 ? 'text-red-500' : 'text-green-500'}`}
                >
                  {index % 2 === 0 ? '-23,10%' : '27,79%'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${index % 2 === 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'}`}
                  >
                    {index % 2 === 0 ? 'STOCK' : 'FI'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
