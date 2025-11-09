import React from 'react'
import inventory1 from '../assets/inventory1.png'
import inventory2 from '../assets/inventory2.png'
import inventory3 from '../assets/inventory3.png'

const ServicesData = [
  {
    id: 1,
    image : inventory1,
    title: "Warehouse Management",
    subtitle: "Manage stock centrally across multiple warehouses"
  },
  {
      id: 2,
      image : inventory3,
      title: "Order Management",
      subtitle: "Manage sales and purchasing activities efficiently with ease"
    },
    {
      id: 3,
      image : inventory2,
      title: "Reports and Analysis",
      subtitle: "Get insights into inventory, vendors, and sales data of sales and purchasing activities efficiently and easily"
    },
]

const Main = () => {
    return (
        <div className='flex items-center flex-col mt-5 text-center px-6 justify-center'>
                <section className="w-screen bg-[url('./assets/gelombang.jpg')] bg-cover bg-center bg-no-repeat py-35 text-center text-red-950">
                <h3 className='text-3xl md:text-5xl font-semibold mb-4 '>
                    Welcome to Inventory Management System
                </h3>
                </section>
                <p className='text-red-800 mb-10 max-w-2xl opacity-70'>
                   Manage inventory, orders, and reports easily and efficiently.
                   Monitor all your warehouse activity in one place
                </p>

                <div className='text-center max-w-lg mx-auto space-y-2 mt-20'>
                    <h1
                    className='text-3xl font-bold text-pink-300'>
                    <span className='text-red-900'>Fitur 
                    </span><span className='text-red-800'> K-stockInventory</span>
                    </h1>
                    <p className='opacity-50 mt-10 text-red-800'>
                        Enjoy an easier, faster, and more organized inventory management experience.
                        Each feature is designed with an elegant appearance and maximum performance to support your business needs
                    </p>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10'>
                    {ServicesData.map((service) => (
                    <div key={service.id} className='text-center p-4 space-y-6'>
                        <img 
                            src={service.image} 
                            alt=''
                            className='img-shadow2 max-w-[200px] mx-auto hover:scale-110 duration-300 cursor-pointer h-auto' />
                        <div className='space-y-2'>
                            <h1 className='text-2xl font-bold text-red-800'>{service.title}</h1>
                            <p className='text-red-900' >{service.subtitle}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
    )
}

export default Main