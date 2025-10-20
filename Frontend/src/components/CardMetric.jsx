import React from "react";

const CardMetric = ({title, value, color}) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition">
            <h2 className="text-gray-500 text-sm font-medium mb-2">{title}</h2>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
    )
}

export default CardMetric