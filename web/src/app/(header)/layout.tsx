import AppHeader from '@/components/AppHeader'
import React from 'react'

const layout = ({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) => {
    return (
        <div className="z-50 flex flex-col min-h-screen">
            <AppHeader />
            {children}
        </div>
    )
}

export default layout