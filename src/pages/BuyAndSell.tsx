import React, { useState, useEffect, useRef } from 'react'
import { LuChevronDown, LuChevronRight, LuFilter } from 'react-icons/lu'
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

  // Dropdowns abertos
  const [_, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Fechar dropdown ao clicar fora
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

  // Opções dinâmicas
  const years = Array.from(
    new Set(rows.map(r => new Date(r.date).getFullYear().toString()))
  )
  const allAssets = Array.from(
    new Set(rows.flatMap(r => r.assets.map(a => a.name)))
  )
  const allTypes = ['buy', 'sell']

  // Filtro aplicado
  const filteredRows = rows
    .map(row => {
      // Filtrar assets pelo tipo e asset selecionado
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
      // Só mostra linhas que tenham pelo menos um asset após o filtro
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

  useEffect(() => {
    getBuySellHistory().then(data => setRows(data))
  }, [])

  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  // Chips dos filtros ativos
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
      {/* Chips dos filtros ativos */}
      {renderActiveChips()}
      {/* Botão Filters */}
      <div className="mb-6 flex items-center">
        <button
          type="button"
          className="flex items-center gap-2 bg-white border border-gray-300 rounded px-4 py-2 shadow-sm hover:bg-emerald-50 transition-colors text-emerald-700 font-medium"
          onClick={() => setFilterPanelOpen(true)}
        >
          <LuFilter className="h-5 w-5" /> Filters
        </button>
      </div>
      {/* Painel de filtros */}
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
            {/* Ano */}
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
            {/* Tipo */}
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
      <div className="bg-white rounded-2xl shadow-lg p-0 overflow-hidden">
        <table className="w-full min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-4">ID</th>
              <th className="text-left py-3 px-4">DATE</th>
              <th className="text-left py-3 px-4">TOTAL</th>
              <th className="text-left py-3 px-4">TAX</th>
              <th className="py-3 px-4" />
            </tr>
          </thead>
          <tbody>
            {filteredRows.map(row => (
              <React.Fragment key={row.id}>
                <tr
                  className="border-t hover:bg-emerald-50/40 cursor-pointer transition-colors duration-200 group"
                  onClick={() =>
                    setExpanded(expanded === row.id ? null : row.id)
                  }
                  onKeyUp={() =>
                    setExpanded(expanded === row.id ? null : row.id)
                  }
                >
                  <td className="py-3 px-4 font-medium text-emerald-600">
                    #{row.id}
                  </td>
                  <td className="py-3 px-4">
                    {new Date(row.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-emerald-500">
                    R${' '}
                    {row.total.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-3 px-4 text-emerald-400">
                    R${' '}
                    {row.tax.toLocaleString('pt-BR', {
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
                {/* Detalhes com animação suave */}
                <tr>
                  <td colSpan={5} className="p-0">
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
                                  R${' '}
                                  {detail.price.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 2,
                                  })}
                                </td>
                                <td className="py-2 px-4 text-center">
                                  {detail.quantity}
                                </td>
                                <td className="py-2 px-4 text-center text-emerald-500">
                                  R${' '}
                                  {detail.total.toLocaleString('pt-BR', {
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
