
import { Navbar } from '@/components/navbar';
import React from 'react'


const Layout = ({ children }) => {
  return (
    <div>

    <Navbar />
    <div className="mt-16">
      {children}
    </div>
    </div>
  )
}

export default Layout;