import {
  LuLayoutDashboard,
  LuDollarSign,
  LuBarChart3,
  LuTrendingUp,
  LuPieChart,
  LuWallet,
  LuTrendingDown,
  LuArrowUpCircle,
  LuPlusCircle,
  LuX,
} from "react-icons/lu";

import React, { useState, useEffect } from "react";
import { getDividendProgression, getMonthlyBreakdown } from '../services/dividendService';

export default function Dividend() {
  const [selectedYear, setSelectedYear] = useState("2023");
  const [showModal, setShowModal] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [formData, setFormData] = useState({
    asset: "",
    value: "",
    date: "",
  });
  const [formErrors, setFormErrors] = useState({
    asset: "",
    value: "",
    date: "",
  });
  const [chartData, setChartData] = useState<{month: string, value: number}[]>([]);
  const [monthlyData, setMonthlyData] = useState<{month: string, value: number}[]>([]);
  const [assets, setAssets] = useState<string[]>([]);
  const width = "100%";
  const height = 256;
  const leftPadding = 70;
  const rightPadding = 40;
  const extremePadding = 70;
  const maxValue = 200;
  const xScale = (index: number) => {
    const usableWidth = windowWidth - leftPadding - rightPadding - 2 * extremePadding;
    return leftPadding + extremePadding + usableWidth * (index / (chartData.length - 1));
  };
  const yScale = (value: number) =>
    height - (height - 2 * rightPadding) * (value / maxValue) - rightPadding;
  const points = chartData.map((d: any, i: number) => ({
    x: xScale(i),
    y: yScale(d.value),
    value: d.value,
    month: d.month,
  }));
  const path = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x},${point.y}`;
    return `${acc} L ${point.x},${point.y}`;
  }, "");
  const areaPath = `${path} L ${points[points.length - 1]?.x || 0},${height - rightPadding} L ${points[0]?.x || 0},${height - rightPadding} Z`;

  // Estrutura para a tabela mensal
  const [monthlyTable, setMonthlyTable] = useState<{ asset: string, values: (number|null)[] }[]>([]);
  const allMonths = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
  ];

  useEffect(() => {
    // Fetch progression data
    getDividendProgression()
      .then((data) => {
        const yearData = data.find((d: any) => d.year.toString() === selectedYear);
        const progression = yearData ? yearData.progression : [];
        // Garantir todos os meses
        const filled = allMonths.map(month => {
          const found = progression.find((p: any) => p.month === month);
          return found ? found : { month, value: 0 };
        });
        setChartData(filled);
      });
  }, [selectedYear]);

  useEffect(() => {
    getMonthlyBreakdown().then((data) => {
      setAssets(data.map((a: any) => a.asset));
      // Montar a tabela: cada asset, array de valores por mês
      const table = data.map((assetObj: any) => {
        const values = allMonths.map((month) => {
          const found = assetObj.breakdown.find((b: any) => b.month === month);
          return found ? found.value : null;
        });
        return { asset: assetObj.asset, values };
      });
      setMonthlyTable(table);
    });
    // monthlyData para header
    setMonthlyData(allMonths.map((month) => ({ month, value: 0 })));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let errors = {
      asset: "",
      value: "",
      date: "",
    };
    if (!formData.asset) errors.asset = "Asset is required";
    if (!formData.value) errors.value = "Value is required";
    if (!formData.date) errors.date = "Date is required";
    if (Object.values(errors).some((error) => error)) {
      setFormErrors(errors);
      return;
    }
    // Handle form submission
    setShowModal(false);
    setFormData({
      asset: "",
      value: "",
      date: "",
    });
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <LuWallet className="h-8 w-8 text-emerald-500" />
            <div className="ml-4">
              <div className="text-sm text-gray-500">Wallet Value</div>
              <div className="text-2xl font-bold text-gray-400">
                R$ 420,00
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center">
            <LuArrowUpCircle className="h-8 w-8 text-emerald-500" />
            <div className="ml-4">
              <div className="text-sm text-gray-500">
                Highest Dividend (2023)
              </div>
              <div className="text-2xl font-bold text-gray-900">
                R$ 149,50
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Dividend Progression
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setSelectedYear("2022")}
                className={`px-4 py-2 rounded-md transition-all ${selectedYear === "2022" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-emerald-50"}`}
              >
                2022
              </button>
              <button
                onClick={() => setSelectedYear("2023")}
                className={`px-4 py-2 rounded-md transition-all ${selectedYear === "2023" ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-emerald-50"}`}
              >
                2023
              </button>
            </div>
          </div>

          <div className="w-full h-64 bg-gradient-to-b from-emerald-50/50">
            <svg width={width} height="100%" viewBox={`0 0 ${windowWidth} ${height}`} preserveAspectRatio="xMidYMid meet">
              {Array.from({
                length: 5,
              }).map((_, i) => (
                <g key={i}>
                  <line
                    x1={leftPadding}
                    y1={yScale(i * 50)}
                    x2={windowWidth - rightPadding}
                    y2={yScale(i * 50)}
                    stroke="#e5e7eb"
                    strokeDasharray="4,4"
                  />
                  <text
                    x={leftPadding - 10}
                    y={yScale(i * 50)}
                    textAnchor="end"
                    alignmentBaseline="middle"
                    className="text-xs text-gray-500"
                  >
                    {i * 50}
                  </text>
                </g>
              ))}

              <path d={areaPath} fill="url(#gradient)" opacity="0.2" />
              <path d={path} fill="none" stroke="#10b981" strokeWidth="2" />

              {points.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="4"
                    fill="#10b981"
                    className="cursor-pointer"
                  />
                  <text
                    x={point.x}
                    y={point.y - 10}
                    textAnchor="middle"
                    fill="#10b981"
                    className="text-xs"
                  >
                    R${point.value}
                  </text>
                  <text
                    x={point.x}
                    y={height - 10}
                    textAnchor="middle"
                    fill="#6b7280"
                    className="text-xs"
                  >
                    {point.month}
                  </text>
                </g>
              ))}

              <defs>
                <linearGradient
                  id="gradient"
                  x1="0%"
                  y1="0%"
                  x2="0%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Monthly Breakdown
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left py-3 px-4 bg-gray-50">Asset</th>
                  {monthlyData.map((month, index) => (
                    <th
                      key={index}
                      className="text-left py-3 px-4 bg-gray-50"
                    >
                      {month.month}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {monthlyTable.map((row, index) => (
                  <tr key={index} className="border-t hover:bg-emerald-50">
                    <td className="py-3 px-4 font-medium">{row.asset}</td>
                    {row.values.map((value, mIndex) => (
                      <td key={mIndex} className="py-3 px-4">
                        {value !== null ? `R$ ${value.toFixed(2)}` : "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-emerald-500 text-white p-4 rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
      >
        <LuPlusCircle className="h-6 w-6" />
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b">
              <h3 className="text-lg font-semibold">Add New Dividend</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <LuX className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Asset
                </label>
                <select
                  value={formData.asset}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      asset: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select an asset</option>
                  {assets.map((asset) => (
                    <option key={asset} value={asset}>
                      {asset}
                    </option>
                  ))}
                </select>
                {formErrors.asset && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.asset}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      value: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0.00"
                />
                {formErrors.value && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.value}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      date: e.target.value,
                    })
                  }
                  className="w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                {formErrors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {formErrors.date}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white rounded-md py-2 px-4 hover:bg-emerald-600 transition-colors"
              >
                Add Dividend
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
