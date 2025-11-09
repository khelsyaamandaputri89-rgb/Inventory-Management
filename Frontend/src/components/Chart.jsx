import React from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts"

const Chart = ({ data, title, time, name, barName }) => {
  const maxSales = Math.max(...data.map(d => d.sales || 0))
  const maxStock = Math.max(...data.map(d => d.stock || 0))

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">{title}</h2>
        <span className="text-gray-400 text-sm">{time}</span>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} className="text-sm" >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name"
            tick={({ x, y, payload }) => {
              const words = payload.value.split(" ");
              return (
                <text x={x} y={y + 10} textAnchor="middle" fontSize={10} fill="#555">
                  {words.map((word, index) => (
                    <tspan key={index} x={x} dy={index === 0 ? 0 : 10}>
                      {word}
                    </tspan>
                  ))}
                </text>
              )
            }}
            interval={0}
              tickFormatter={(value) =>
                value.length > 10 ? value.replace(" ", "\n") : value
              }
            textAnchor="middle"
          />

          <YAxis
            yAxisId="left"
            orientation="left"
            domain={[0, maxSales + maxSales * 0.2]} 
            tickFormatter={(v) => `Rp ${(v / 1000).toFixed(0)}K`} 
            tick={{ fontSize: 8, dy : 4 }} 
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, maxStock + maxStock * 0.2]}
          />

          <Tooltip
            formatter={(value, name) => {
              if (name === "sales") return [`Rp ${value.toLocaleString()}`, "Sales"]
              return [value, "Stock"]
            }}
          />

          <Legend />
          <Bar dataKey="sales" fill="#662222" name={name} yAxisId="left" />
          <Bar dataKey="stock" fill="#F5DAA7" name={barName} yAxisId="right" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default Chart
