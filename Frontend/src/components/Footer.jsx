import React from 'react'
import {
    FaFacebook,
    FaGoogle,
    FaInstagram,
    FaPhone,
    FaTelegram
} from 'react-icons/fa'
import {FaMapMarkerAlt} from 'react-icons/fa'

const Footer = () => {
    return (
        <div className='w-screen relative left-1/2 right-1/2 -mx-[50vw] bg-gradient-to-r to-red-800 from-[#cd2345] pt-12 pb-8 mt-15'>
          <div className="max-w-6xl mx-auto px-6">
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-20 text-white '>
                <div className='space-y-6 pl-8'>
                    <h1 className='text-3xl font-semibold text-left '>Contact Us</h1>
                <div className='text-left'>
                    <p>
                        <FaPhone />
                        +62 823-2206-2318
                    </p>
                    <p>
                        {" "}
                        <FaMapMarkerAlt />
                        Cihasem Village, Pasir Panjang Village, Salem District, Brebes Regency, Central Java
                    </p>
                </div>
            </div>
            <div className='space-y-9 pl-8'>
                <h1 className='text-3xl font-semibold text-left'>Operasional Hours</h1>
                <div className='grid grid-cols-2 gap-2 text-left'>
                    <div>
                        <ul className='space-y-2 '>
                            <li>Monday-Friday :</li>
                            <li>Saturday,Sunday,& National Holiday :</li>
                        </ul>
                    </div>
                    <div>
                        <ul className='space-y-2'>
                            <li>07.00 - 17.00 WIB</li>
                            <li>07.00 - 15.00 WIB</li>
                        </ul>
                    </div>
                </div>
             </div>
             <div className='space-y-6 pl-8'>
                <h1 className='text-3xl font-semibold text-left'>Follow Us</h1>
                    <div className='flex gap-3 items-center'>
                        <FaFacebook  className='text-3xl hover:scale-105 duration-300'/>
                        <FaInstagram className='text-3xl hover:scale-105 duration-300'/>
                        <FaTelegram className='text-3xl hover:scale-105 duration-300'/>
                        <FaGoogle className='text-3xl hover:scale-105 duration-300'/>
                    </div>
                </div>
             </div>
            <p className='text-white text-center mt-8 pt-8 border-t-1 w-1/2 mx-auto '>
                Copyright &copy; 2024 Company Khelsya. All rights reserved
            </p>
          </div>
        </div>
    )
}

export default Footer