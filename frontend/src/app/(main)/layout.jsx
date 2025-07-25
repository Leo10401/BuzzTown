import React from 'react';
import { BrowseProvider } from '@/context/BrowseContext';
import { Navbar } from '@/components/navbar';

const Layout = ({ children }) => {
    return (
        <BrowseProvider>
            <div className='pt-20'>
                <Navbar />
                {children}
            </div>
        </BrowseProvider>
    )
}

export default Layout