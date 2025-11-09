import React from "react"

const CardMetric = ({ title, value, color, valueSize = "text-2xl" }) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
      <h2 className="text-gray-500 text-sm font-medium mb-2">{title}</h2>
      <p className={`font-bold ${color} ${valueSize} transition-all duration-300`}>
        {value}
      </p>
    </div>
  )
}

export default CardMetric
