import React from "react"
import { FiEdit2 } from "react-icons/fi"
import { FaRegTrashCan } from "react-icons/fa6"
import { IoSearchOutline } from "react-icons/io5"

const Table = ({
  columns = [],
  data = [],
  onAdd,
  onEdit,
  onDelete,
  onSearch,
  onOrder,
  isUser = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md ml-64">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4 relative">
            <div className="relative w-1/3">
              <IoSearchOutline className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => onSearch?.(e.target.value)}
                className="border px-3 py-2 pl-9 rounded-md w-full focus:ring-2 focus:ring-red-800 outline-none"
              />
            </div>

            {onAdd && (
              <button
                onClick={onAdd}
                className="bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-800/50 transition"
              >
                + Add New
              </button>
            )}
          </div>

          <div className="overflow-x-auto mx-auto py-5">
            <div className="inline-block min-w-full align-middle">
              <div className="rounded-t-lg overflow-hidden">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 text-gray-700">
                    <tr>
                      {columns.map((col, i) => (
                        <th
                          key={i}
                          className="px-4 py-4 text-left whitespace-nowrap border-b border-gray-200"
                        >
                          {col.header}
                        </th>
                      ))}
                      {(onEdit || onDelete || isUser) && (
                        <th className="px-4 py-4 text-center">Actions</th>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {Array.isArray(data) && data.length > 0 ? (
                      data.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-gray-50">
                          {columns.map((col, j) => (
                            <td key={j} className="px-4 py-3 whitespace-nowrap">
                              {col.render
                                ? col.render(row[col.accessor])
                                : typeof row[col.accessor] === "object"
                                ? JSON.stringify(row[col.accessor])
                                : row[col.accessor]}
                            </td>
                          ))}
                          {(onEdit || onDelete || isUser) && (
                            <td className="px-4 py-2 text-center">
                              {isUser ? (
                                <button
                                  onClick={() => onOrder && onOrder(row)}
                                  className="bg-red-800 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                                >
                                  Order
                                </button>
                              ) : (
                                <>
                                  {onEdit && (
                                    <button
                                      onClick={() => onEdit(row)}
                                      className="text-red-700 hover:text-red-950"
                                    >
                                      <FiEdit2 />
                                    </button>
                                  )}
                                  {onDelete && (
                                    <button
                                      onClick={() => onDelete(row.id)}
                                      className="text-red-600 hover:text-red-800 ml-2"
                                    >
                                      <FaRegTrashCan />
                                    </button>
                                  )}
                                </>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="text-center py-6 text-gray-500"
                        >
                          No data found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default Table
