import React from 'react'
import {Link} from 'react-router-dom'

const Header = () => {
    return (
        <div className='left-0 top-0 w-full p-6 justify-between items-center flex'>
            <h1 className='text-3xl font-bold text-red-800'><span className='text-outline' 
                style={{ WebkitTextStroke: '1px maroon', color: 'transparent' }}>K-smart</span>Inventory
            </h1>
            <Link to="/login" className='bg-red-800 text-white px-4 py-2 rounded-lg hover:bg-red-700'>Login</Link>
        </div>
    )
}

export default Header