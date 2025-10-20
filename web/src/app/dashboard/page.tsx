"use client"

import PromptBox from "@/components/PromptBox"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "../../api/axiosInstance"
import { Controller, useForm } from "react-hook-form"
import { z } from 'zod'
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import FormPreview from "@/components/FormPreview"
import {  FormSchema } from "@/types/form"
import { useState } from "react"

const generarteFormSchema = z.object({
    prompt: z.string().min(10).max(5000)
})

const page = () => {
    const router = useRouter()
    const [formSchema, setFormSchema] = useState<FormSchema>()
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const form = useForm<z.infer<typeof generarteFormSchema>>({
        resolver: zodResolver(generarteFormSchema),
        defaultValues: {
            prompt: ""
        }
    })

    async function handleGenerateForm(values: z.infer<typeof generarteFormSchema>) {
        try {
            const response = await axios.post("/form/generate", {
                ...values
            })

            console.log("form schema generated: ", response.data)

            setFormSchema(response.data.data.form)
            setShowPreview(true)

            form.reset()
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

    function onClose() {
        setShowPreview(false)
        setFormSchema(undefined)
    }

    return (
    <form
        onSubmit={form.handleSubmit(handleGenerateForm)}
        className='grow relative h-full bg-background flex flex-col gap-10 justify-center items-center'
    >
        <div className="text-4xl z-2 text-foreground">
            Let's build something <span className="text-primary font-medium">AMAZING</span> today
        </div>
        <Controller
            name="prompt"
            control={form.control}
            render={({ field }) => (
                <PromptBox
                placeholder="What kind of form would you like to create today?"
                value={field.value}
                onChange={field.onChange}
                />
            )}
        />
        {showPreview && formSchema && <FormPreview schema={formSchema} onClick={onClose}/>}
    </form>
    );

}

export default page