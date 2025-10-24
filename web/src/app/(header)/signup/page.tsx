"use client"

import React from 'react'
import { 
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'  
import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import FormHeader from '@/components/FormHeader'
import FormDescription from '@/components/FormDescription'
import { useRouter } from 'next/navigation'
import axios from "../../../api/axiosInstance"
import { toast } from 'sonner'
import { AxiosError } from 'axios'

const signinSchema = z.object({
    email: z.email("invalid email address").max(100).trim().toLowerCase(),
    username: z.string().min(2, "name must contain at least 2 characters").max(50, "name is too long").trim(),
    password: z.string().min(8, "password must be at least 8 characters").max(72, "password is too long")
})

const page = () => {
    const router = useRouter()
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            username: "",
            email: "",
            password: ""
        },
    })

    async function onSubmit(values: z.infer<typeof signinSchema>) {
        try {
            const response = await axios.post("/auth/register", {
                ...values
            })

            const data = response.data

            console.log("user registered successfully", response.data)
            toast("you have registered successfully")
            router.push("/signin")
        } catch(err) {
            if(err instanceof AxiosError) {
                const status = err.response?.status;

                switch(status) {
                    case 401:
                        toast("unauthorised, please log in again")
                        router.push("/signin")
                        break
                    default:
                        toast(err.response?.data?.message || "something went wrong, try again later");
                }
            } else{
                toast("something went wrong, try again later")
            }
        }
    }

    return (
        <div className='relative grow h-full bg-background flex justify-center items-center'>
            <svg className='w-full h-full fixed z-1' viewBox='0 0 160 90' preserveAspectRatio="none">
                <g stroke="#bbb" strokeOpacity="0.2" strokeWidth="0.3" fill="none">
                    <path d="M0,25 C40,20 80,40 160,50" />
                    <path d="M0,30 C50,22 85,45 160,52" />
                    <path d="M0,35 C45,25 75,55 160,55" />
                    <path d="M0,40 C55,30 85,50 160,58" className='stroke-primary'/>
                    <path d="M0,45 C43,35 78,53 160,60" />
                    <path d="M0,50 C52,33 82,60 160,62" />
                    <path d="M0,55 C47,37 80,57 160,65" />
                    <path d="M0,60 C50,40 83,60 160,67" className='stroke-primary'/>
                    <path d="M0,65 C53,38 81,62 160,70" />
                </g>
            </svg>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='w-lg p-6 rounded-lg space-y-6 border border-border bg-card z-2'>
                    <div className=''>
                        <FormHeader headerText='Create Your Account'/>
                        <FormDescription description='Quick and easy sign-up to access all features and personalized content. Just a few details to get started instantly.'/>
                    </div>
                    <div className='space-y-4'>
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className='text-card-foreground'>Username</FormLabel>
                                        <FormControl>
                                            <Input placeholder="John Doe" {...field} className='text-foreground placeholder:text-muted-foreground focus:ring-ring'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name='email'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className='text-card-foreground'>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="johndoe@gmail.com" {...field} className='text-foreground placeholder:text-muted-foreground focus:ring-ring'/>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}>
                        </FormField>
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => {
                                return (
                                    <FormItem>
                                        <FormLabel className='text-card-foreground'>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder=". . . . . . . ." className='text-foreground placeholder:text-muted-foreground focus:ring-ring' {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}>
                        </FormField>
                    </div>
                    <div>
                        <Button variant="default" size="lg" className='mt-2 w-full font-bold bg-foreground text-background'>Register</Button>
                        <div className='mt-1 text-center text-foreground/90'>
                            Already have an account? 
                            <span
                                onClick={() => router.push("/signin")} 
                                className='text-primary/90 font-semibold underline cursor-pointer hover:text-primary'
                            >
                                Sign in
                            </span>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}

export default page