import React from 'react'
import Header from '../components/Header.jsx'
import Main from '../components/Main.jsx'
import Footer from '../components/Footer.jsx'

const Home = () => {
    return (
        <>
            <div className='min-h-screen flex flex-col bg-white text-gray-800n'>
                <Header />
                <Main />
                <Footer />
            </div>
        </>
    )
}

export default Home