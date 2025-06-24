import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LuUser, LuPlus, LuX, LuLogOut } from 'react-icons/lu'

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const [addBalanceAmount, setAddBalanceAmount] = useState('')
  const [showAddBalance, setShowAddBalance] = useState(false)
  const navigate = useNavigate()

  const handleAddBalance = () => {
    console.log('Adicionando saldo:', addBalanceAmount)
    setAddBalanceAmount('')
    setShowAddBalance(false)
  }

  const handleLogout = () => {
    console.log('Fazendo logout...')
    onClose()
    navigate('/login')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-96 max-w-[90vw]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
              <LuUser className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Bruno Costa</h3>
              <p className="text-sm text-gray-500">bruno.costa@email.com</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <LuX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showAddBalance ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Available Balance</p>
                  <p className="text-lg font-semibold">R$ 420,00</p>
                </div>
                <button
                  onClick={() => setShowAddBalance(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors"
                >
                  <LuPlus size={16} />
                  Add
                </button>
              </div>

              {/* Linha separadora */}
              <div className="border-t border-gray-200 my-4"></div>

              <div className="space-y-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 border border-red-500 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LuLogOut size={16} />
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Add Balance</h4>
                <p className="text-sm text-gray-500 mb-4">
                  Enter the amount you want to add to your available balance.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (R$)
                </label>
                <input
                  type="number"
                  value={addBalanceAmount}
                  onChange={(e) => setAddBalanceAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddBalance(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddBalance}
                  disabled={!addBalanceAmount || parseFloat(addBalanceAmount) <= 0}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 