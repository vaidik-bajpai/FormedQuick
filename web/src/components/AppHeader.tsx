import React from 'react'
import { Button } from './ui/button'

const AppHeader = () => {
    return (
        <h1 className='flex-none sticky top-0 left-0 py-4 px-12 w-full bg-background border-b border-border'>
            <div className='mx-auto flex justify-between items-center'>
                <div className='text-3xl text-foreground'>Formed<span className='font-bold text-primary'>Quick</span></div>
                <Button variant="outline" size="lg" className='font-bold !bg-primary !text-primary-foreground border-2 border-border'>Get started</Button>
            </div>  
        </h1>
    )
}

export default AppHeader