import React from "react"
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from "recharts"

const Chart = ({data}) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Sales vs Stock</h2>
                <span className="text-gray-400 text-sm">Last 30 days</span>
            </div>

            <ResponsiveContainer width="100%" height={400}>
                <BarChart data = {data}>
                    <CartesianGrid strokeDasharray = "3 3" />
                    <XAxis dataKey = "name" />
                    <YAxis yAxisId="left" orientation="left"/>
                    <YAxis yAxisId="right" orientation="right"/>
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" fill="#662222" name="Sales" yAxisId="left" />
                    <Bar dataKey="stock" fill="#F5DAA7" name="Stock" yAxisId="right" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default Chart