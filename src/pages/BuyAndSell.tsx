import React, { useState, useEffect, useRef } from 'react'
import { LuChevronDown, LuChevronRight, LuFilter, LuPlus, LuX, LuPencil } from 'react-icons/lu'
import { getBuySellHistory } from '../services/buySellService'

type AssetDetail = {
  id: number
  name: string
  quantity: number
  price: number
  total: number
  type: string
}

type BuySellRow = {
  id: number
  total: number
  date: string
  tax: number
  assets: AssetDetail[]
}

export default function BuyAndSell() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [rows, setRows] = useState<BuySellRow[]>([])
  const [yearFilter, setYearFilter] = useState<string[]>([])
  const [typeFilter, setTypeFilter] = useState<string[]>([])
  const [assetFilter, setAssetFilter] = useState<string[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingRow, setEditingRow] = useState<BuySellRow | null>(null)

  // Open dropdowns
  const [_, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // State for new transaction
  const [newTransaction, setNewTransaction] = useState({
    date: '',
    assets: [{ name: '', quantity: '', price: '', type: 'buy' }],
    tax: ''
  })

  // State for transaction editing
  const [editTransaction, setEditTransaction] = useState({
    id: 0,
    date: '',
    tax: '',
    assets: [{ id: 0, name: '', quantity: '', price: '', type: 'buy' }]
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dynamic options
  const years = Array.from(
    new Set(rows.map(r => new Date(r.date).getFullYear().toString()))
  )
  const allAssets = Array.from(
    new Set(rows.flatMap(r => r.assets.map(a => a.name)))
  )
  const allTypes = ['buy', 'sell']

  // Applied filter
  const filteredRows = rows
    .map(row => {
      // Filter assets by type and selected asset
      let filteredAssets = row.assets
      if (typeFilter.length > 0) {
        filteredAssets = filteredAssets.filter(a =>
          typeFilter.includes(a.type.toLowerCase())
        )
      }
      if (assetFilter.length > 0) {
        filteredAssets = filteredAssets.filter(a =>
          assetFilter.includes(a.name)
        )
      }
      return { ...row, assets: filteredAssets }
    })
    .filter(row => {
      const yearOk =
        yearFilter.length === 0 ||
        yearFilter.includes(new Date(row.date).getFullYear().toString())
      // Only show rows that have at least one asset after filtering
      return yearOk && row.assets.length > 0
    })

  function toggleFilterValue(
    arr: string[],
    value: string,
    setArr: (v: string[]) => void
  ) {
    if (arr.includes(value)) {
      setArr(arr.filter(v => v !== value))
    } else {
      setArr([...arr, value])
    }
  }

  function clearFilters() {
    setYearFilter([])
    setTypeFilter([])
    setAssetFilter([])
  }

  const handleAddAsset = () => {
    setNewTransaction(prev => ({
      ...prev,
      assets: [...prev.assets, { name: '', quantity: '', price: '', type: 'buy' }]
    }))
  }

  const handleRemoveAsset = (index: number) => {
    setNewTransaction(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }))
  }

  const handleAssetChange = (index: number, field: string, value: string) => {
    setNewTransaction(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    }))
  }

  const handleSaveTransaction = () => {
    // Here you would implement the logic to save the transaction
    console.log('New transaction:', newTransaction)
    setShowAddModal(false)
    setNewTransaction({
      date: '',
      assets: [{ name: '', quantity: '', price: '', type: 'buy' }],
      tax: ''
    })
  }

  const handleEditTransaction = (row: BuySellRow) => {
    setEditingRow(row)
    setEditTransaction({
      id: row.id,
      date: row.date,
      tax: row.tax.toString(),
      assets: row.assets.map(asset => ({
        id: asset.id,
        name: asset.name,
        quantity: asset.quantity.toString(),
        price: asset.price.toString(),
        type: asset.type
      }))
    })
    setShowEditModal(true)
  }

  const handleEditAssetChange = (index: number, field: string, value: string) => {
    setEditTransaction(prev => ({
      ...prev,
      assets: prev.assets.map((asset, i) => 
        i === index ? { ...asset, [field]: value } : asset
      )
    }))
  }

  const handleAddEditAsset = () => {
    setEditTransaction(prev => ({
      ...prev,
      assets: [...prev.assets, { id: 0, name: '', quantity: '', price: '', type: 'buy' }]
    }))
  }

  const handleRemoveEditAsset = (index: number) => {
    setEditTransaction(prev => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index)
    }))
  }

  const handleSaveEditTransaction = () => {
    // Here you would implement the logic to save the edited transaction
    console.log('Edited transaction:', editTransaction)
    setShowEditModal(false)
    setEditingRow(null)
    setEditTransaction({
      id: 0,
      date: '',
      tax: '',
      assets: [{ id: 0, name: '', quantity: '', price: '', type: 'buy' }]
    })
  }

  useEffect(() => {
    getBuySellHistory().then(data => setRows(data))
  }, [])

  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  // Active filter chips
  function renderActiveChips() {
    const chips: { label: string; value: string; onRemove: () => void }[] = []

    for (const year of yearFilter) {
      chips.push({
        label: year,
        value: year,
        onRemove: () => setYearFilter(yearFilter.filter(f => f !== year)),
      })
    }

    for (const type of typeFilter) {
      chips.push({
        label: type.toUpperCase(),
        value: type,
        onRemove: () => setTypeFilter(typeFilter.filter(f => f !== type)),
      })
    }

    for (const asset of assetFilter) {
      chips.push({
        label: asset,
        value: asset,
        onRemove: () => setTypeFilter(assetFilter.filter(f => f !== asset)),
      })
    }

    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {chips.map(chip => (
          <span
            key={chip.label}
            className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-medium"
          >
            {chip.label}
            <button
              type="button"
              className="ml-2 text-gray-400 hover:text-red-500"
              onClick={chip.onRemove}
            >
              &times;
            </button>
          </span>
        ))}
        {chips.length > 0 && (
          <button
            type="button"
            className="ml-2 text-gray-400 hover:text-red-500 text-base px-2 py-1 rounded-full border border-transparent hover:border-red-200 transition-colors"
            title="Clear filters"
            onClick={clearFilters}
          >
            Clear all
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="w-full p-6">
      {/* Active filter chips */}
      {renderActiveChips()}
      {/* Action buttons */}
      <div className="mb-6 flex items-center justify-between">
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-emerald-50 transition-colors text-emerald-700 font-medium"
          onClick={() => setFilterPanelOpen(true)}
        >
          <LuFilter className="h-5 w-5" /> Filters
        </button>
        
        <button
          type="button"
          className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-emerald-600 transition-colors font-medium"
          onClick={() => setShowAddModal(true)}
        >
          <LuPlus className="h-5 w-5" /> Add Transaction
        </button>
      </div>

      {/* Modal to edit transaction */}
      {showEditModal && editingRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Edit Transaction #{editingRow.id}</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <LuX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={editTransaction.date}
                  onChange={(e) => setEditTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Tax */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ($)
                </label>
                <input
                  type="number"
                  value={editTransaction.tax}
                  onChange={(e) => setEditTransaction(prev => ({ ...prev, tax: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Assets */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Assets
                  </label>
                  <button
                    type="button"
                    onClick={handleAddEditAsset}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <LuPlus size={16} /> Add Asset
                  </button>
                </div>

                <div className="space-y-4">
                  {editTransaction.assets.map((asset, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">Asset</label>
                        <input
                          type="text"
                          value={asset.name}
                          onChange={(e) => handleEditAssetChange(index, 'name', e.target.value)}
                          placeholder="Asset name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={asset.quantity}
                          onChange={(e) => handleEditAssetChange(index, 'quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Price</label>
                        <input
                          type="number"
                          value={asset.price}
                          onChange={(e) => handleEditAssetChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Type</label>
                        <select
                          value={asset.type}
                          onChange={(e) => handleEditAssetChange(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        >
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-medium">
                          $ {((parseFloat(asset.quantity) || 0) * (parseFloat(asset.price) || 0)).toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {editTransaction.assets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveEditAsset(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <LuX size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEditTransaction}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal to add transaction */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Transaction</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <LuX size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Tax */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ($)
                </label>
                <input
                  type="number"
                  value={newTransaction.tax}
                  onChange={(e) => setNewTransaction(prev => ({ ...prev, tax: e.target.value }))}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Assets */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Assets
                  </label>
                  <button
                    type="button"
                    onClick={handleAddAsset}
                    className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    <LuPlus size={16} /> Add Asset
                  </button>
                </div>

                <div className="space-y-4">
                  {newTransaction.assets.map((asset, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 border border-gray-200 rounded-lg">
                      <div className="col-span-3">
                        <label className="block text-xs text-gray-600 mb-1">Asset</label>
                        <input
                          type="text"
                          value={asset.name}
                          onChange={(e) => handleAssetChange(index, 'name', e.target.value)}
                          placeholder="Asset name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Quantity</label>
                        <input
                          type="number"
                          value={asset.quantity}
                          onChange={(e) => handleAssetChange(index, 'quantity', e.target.value)}
                          placeholder="0"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Price</label>
                        <input
                          type="number"
                          value={asset.price}
                          onChange={(e) => handleAssetChange(index, 'price', e.target.value)}
                          placeholder="0.00"
                          step="0.01"
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Type</label>
                        <select
                          value={asset.type}
                          onChange={(e) => handleAssetChange(index, 'type', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm"
                        >
                          <option value="buy">Buy</option>
                          <option value="sell">Sell</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Total</label>
                        <div className="px-3 py-2 bg-gray-50 rounded-md text-sm font-medium">
                          $ {((parseFloat(asset.quantity) || 0) * (parseFloat(asset.price) || 0)).toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {newTransaction.assets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveAsset(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <LuX size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTransaction}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter panel */}
      {filterPanelOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-30">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fade-in">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setFilterPanelOpen(false)}
              title="Close"
            >
              ×
            </button>
            <h3 className="text-lg font-semibold mb-4">Filters</h3>
            {/* Year */}
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Year</div>
              <div className="flex flex-col gap-1 max-h-32 overflow-auto">
                {years.map(y => (
                  <label key={y} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={yearFilter.includes(y)}
                      onChange={() =>
                        toggleFilterValue(yearFilter, y, setYearFilter)
                      }
                      className="mr-2"
                    />
                    {y}
                  </label>
                ))}
              </div>
            </div>
            {/* Type */}
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Type</div>
              <div className="flex flex-col gap-1">
                {allTypes.map(t => (
                  <label key={t} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={typeFilter.includes(t)}
                      onChange={() =>
                        toggleFilterValue(typeFilter, t, setTypeFilter)
                      }
                      className="mr-2"
                    />
                    {t.toUpperCase()}
                  </label>
                ))}
              </div>
            </div>
            {/* Asset */}
            <div className="mb-4">
              <div className="font-medium text-sm mb-1">Asset</div>
              <div className="flex flex-col gap-1 max-h-32 overflow-auto">
                {allAssets.map(a => (
                  <label key={a} className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={assetFilter.includes(a)}
                      onChange={() =>
                        toggleFilterValue(assetFilter, a, setAssetFilter)
                      }
                      className="mr-2"
                    />
                    {a}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex justify-end mt-6 gap-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-100 text-gray-600 hover:bg-gray-200"
                onClick={clearFilters}
              >
                Clear all
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-emerald-500 text-white hover:bg-emerald-600"
                onClick={() => setFilterPanelOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden relative">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-16 py-3 px-4"></th>
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">DATE</th>
              <th className="text-left py-3 px-4">TOTAL</th>
              <th className="text-left py-3 px-4">TAX</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <React.Fragment key={row.id}>
                <tr
                  className="border-t hover:bg-emerald-50/40 cursor-pointer transition-colors duration-200 group relative"
                  onClick={() =>
                    setExpanded(expanded === row.id ? null : row.id)
                  }
                  onKeyUp={() =>
                    setExpanded(expanded === row.id ? null : row.id)
                  }
                >
                  {/* Edit icon on hover */}
                  <td className="w-16 py-3 px-4">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditTransaction(row)
                        }}
                        className="p-2 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
                      >
                        <LuPencil size={16} />
                      </button>
                    </div>
                  </td>
                  
                  <td className="py-3 px-4 font-medium text-emerald-600">
                    #{row.id}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-500">
                    ${' '}
                    {row.total.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    ${' '}
                    {row.tax.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className="py-3 px-2"
                    onClick={e => e.stopPropagation()}
                    onKeyUp={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setExpanded(expanded === row.id ? null : row.id)
                      }
                      className="focus:outline-none"
                    >
                      {row.assets.length > 0 ? (
                        expanded === row.id ? (
                          <LuChevronDown className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        ) : (
                          <LuChevronRight className="h-5 w-5 text-gray-400 group-hover:text-emerald-500 transition-colors" />
                        )
                      ) : null}
                    </button>
                  </td>
                </tr>
                {/* Details with smooth animation */}
                <tr>
                  <td colSpan={6} className="p-0">
                    <div
                      className={`transition-all duration-300 overflow-hidden bg-gray-50 ${expanded === row.id ? 'max-h-[500px] py-2' : 'max-h-0 py-0'}`}
                      style={{
                        paddingLeft: expanded === row.id ? 0 : undefined,
                      }}
                    >
                      {expanded === row.id && row.assets.length > 0 && (
                        <table className="w-full">
                          <thead>
                            <tr>
                              <th className="py-2 px-8 text-xs text-gray-500 text-left">
                                ASSET
                              </th>
                              <th className="py-2 px-4 text-xs text-gray-500 text-center">
                                PRICE
                              </th>
                              <th className="py-2 px-4 text-xs text-gray-500 text-center">
                                QUANTITY
                              </th>
                              <th className="py-2 px-4 text-xs text-gray-500 text-center">
                                TOTAL
                              </th>
                              <th className="py-2 px-4 text-xs text-gray-500 text-center">
                                TYPE
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {row.assets.map(detail => (
                              <tr key={detail.id} className="border-t">
                                <td className="py-2 px-8 text-left font-medium">
                                  {detail.name}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  ${' '}
                                  {detail.price.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {detail.quantity}
                                </td>
                                <td className="py-2 px-4 text-center text-emerald-500">
                                  ${' '}
                                  {detail.total.toLocaleString('en-US', {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  <span
                                    className={`px-2 py-1 text-xs rounded-full uppercase ${
                                      detail.type.toLowerCase() === 'buy'
                                        ? 'bg-emerald-100 text-emerald-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                                  >
                                    {detail.type}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
