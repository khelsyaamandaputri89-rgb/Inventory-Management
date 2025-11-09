import React from "react"
import Select from "react-select"

const FormModal = ({
    isOpen,
    onClose,
    title,
    fields,
    formData,
    setFormData,
    onSubmit,
}) => {

    if (!isOpen) return null
    
    return (
        <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-semibold mb-4">{title}</h2>

                 <form
                    onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                  }}
                 >
                    {fields.map((field, index) => (
                        <div key={index} className="mb-3">
                            <label className="block mb-1 text-sm font-medium">
                                {field.label}
                            </label>

                            {field.type === "select" ? (
                              <Select
                                options={field.options}
                                value={field.options.find(opt => opt.value === formData[field.name])}
                                onChange={(selected) =>
                                  setFormData({ ...formData, [field.name]: selected?.value })
                                }
                                placeholder={`Select ${field.label}`}
                                menuPlacement="top" 
                                menuPosition="fixed"
                                styles={{
                                  menu: (provided) => ({
                                    ...provided,
                                    zIndex: 9999,
                                    display: "flex",  
                                    flexDirection: "row",
                                    background: "white",
                                    padding: "0.5rem",
                                    gap: "0.5rem",
                                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                                    width: "fit-content" 
                                  }),
                                  option: (provided) => ({
                                    ...provided,
                                    minWidth: "100px",
                                    whiteSpace: "nowrap",
                                  }),
                                }}
                              />
                            ) : field.type === "textarea" ? (
                              <textarea
                                value={formData[field.name] || ""}
                                onChange={(e) =>
                                  setFormData({ ...formData, [field.name]: e.target.value })
                                }
                                className="border border-gray-300 rounded w-full p-2"
                                placeholder={field.placeholder || ""}
                              />
                            ) : (
                            <input
                              type={field.type || "text"}
                              value={formData[field.name] || ""}
                              onChange={(e) =>
                                setFormData({ ...formData, [field.name]: e.target.value })
                              }
                              className="border border-gray-300 rounded w-full p-2"
                              placeholder={field.placeholder || ""}
                            />
                            )}
                        </div>
                    ))}

                     <div className="flex justify-end gap-2 mt-4">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
                        >
                         Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3 py-1 rounded bg-red-800 text-white hover:bg-red-800/50"
                        >
                         Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default FormModal