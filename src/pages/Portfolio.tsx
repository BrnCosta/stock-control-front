import React from "react";

const mockData = [
  { label: "Ação", value: 11897.9, percent: 25.36, color: "#10b981" },
  { label: "BDRs", value: 0, percent: 0, color: "#a3a3a3" },
  { label: "FIIs", value: 32922.5, percent: 70.18, color: "#06b6d4" },
  { label: "Criptos", value: 2093.27, percent: 4.46, color: "#f59e42" },
];
const total = 46913.67;

export default function Portfolio() {
  const pieData = mockData;
  const pieRadius = 75;
  const pieCirc = 2 * Math.PI * pieRadius;
  let acc = 0;
  const pieSegments = pieData.map((d, i) => {
    const start = acc;
    const len = (d.percent / 100) * pieCirc;
    acc += len;
    return {
      ...d,
      offset: start,
      length: len,
    };
  });

  return (
    <div className="w-full p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 flex items-center">
        <div>
          <div className="text-sm text-gray-500">Total Portfolio Value</div>
          <div className="text-3xl font-bold text-gray-900">R$ {total.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 flex flex-col md:flex-row gap-8 items-center justify-between">
        <div className="flex-1 w-full">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Allocation</h2>
          {mockData.map((item, idx) => (
            <div key={item.label} className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span>{item.label}</span>
                <span>
                  R$ {item.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })} ({item.percent.toFixed(2)}%)
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 rounded-full"
                  style={{ width: `${item.percent}%`, background: item.color }}
                ></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center md:p-4">
          <svg width={180} height={180} viewBox="0 0 180 180">
            <g transform="rotate(-90 90 90)">
              {pieSegments.map((seg, i) => (
                <circle
                  key={i}
                  r={pieRadius}
                  cx={90}
                  cy={90}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={28}
                  strokeDasharray={`${seg.length} ${pieCirc - seg.length}`}
                  strokeDashoffset={-seg.offset}
                />
              ))}
            </g>
          </svg>
          <div className="mt-4 flex flex-col gap-2">
            {mockData.map((item, idx) => (
              <div key={item.label} className="flex items-center gap-2 text-sm">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: item.color }}></span>
                <span>{item.label} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 