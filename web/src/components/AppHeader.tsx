"use client"

import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/user.store'
import { Menu } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu'

const AppHeader = () => {
    const router = useRouter();
    const user = useUserStore((state) => state.user)

    return (
        <h1 className='flex-none sticky top-0 left-0 py-4 px-12 w-full bg-background border-b border-border'>
            <div className='mx-auto flex justify-between items-center'>
                <div className='text-3xl text-foreground cursor-pointer hover:scale-105 transition-all delay-100 duration-500' onClick={() => router.push("/dashboard")}>Formed<span className='font-bold text-primary'>Quick</span></div>
                {
                    user ? 
                        <div className='flex gap-4 items-center'>
                            <div className='max-w-72 text-foreground overflow-hidden text-ellipsis'>
                                Welcome back, <span className='text-primary font-bold'>{user.username}</span>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger>
                                    <div className='hover:bg-primary/70 hover:text-primary-foreground p-3 rounded-full cursor-pointer transition-all duration-500 delay-100'>
                                        <Menu />
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuLabel>Main menu</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => router.push("/dashboard")}>Generate</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/my-forms/active=true")}> My forms</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/my-forms/recents=true")}>Recent forms</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => router.push("/my-forms/recents=true")}>Log out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    : <Button
                        variant="outline"
                        size="lg"
                        className='font-bold !bg-primary/90 !text-primary-foreground border-2 border-border hover:!bg-primary hover:cursor-pointer' onClick={() => router.push("/signin")}>
                            Get started
                    </Button>
                }
            </div>  
        </h1>
    )
}

export default AppHeader