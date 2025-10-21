"use client"

import PromptBox from "@/components/PromptBox"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from "../../../api/axiosInstance"
import { Controller, useForm } from "react-hook-form"
import { z } from 'zod'
import { AxiosError } from "axios"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import FormPreview from "@/components/FormPreview"
import {  FormSchema } from "@/types/form.types"
import { useState } from "react"
import { useUserStore } from "@/store/user.store"
import { v4 as uuidv4 } from 'uuid';
import { useRecentFormsStore } from "@/store/form.store"


const generarteFormSchema = z.object({
    prompt: z.string().min(10).max(5000)
})

const page = () => {
    const router = useRouter()
    const [id, setID] = useState<string>("")
    const [formSchema, setFormSchema] = useState<FormSchema>()
    const [showPreview, setShowPreview] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const addRecentForm = useRecentFormsStore((state) => state.addRecentForm);

    const form = useForm<z.infer<typeof generarteFormSchema>>({
        resolver: zodResolver(generarteFormSchema),
        defaultValues: {
            prompt: ""
        }
    })

    const clearUser = useUserStore((state) => state.clearUser)

    async function handleGenerateForm(values: z.infer<typeof generarteFormSchema>) {
        setLoading(true)
        setShowPreview(true)
        console.log("loading: true")
        try {  
            const response = await axios.post("/form/generate", {
                ...values
            })

            console.log("form schema generated: ", response.data)

            const randomID = uuidv4()

            setID(randomID)
            setFormSchema(response.data.data.form)
            setShowPreview(true)
            addRecentForm({
                id: randomID,
                schema: response.data.data.form,
                prompt: response.data.data.prompt,
            })

            form.reset()
        } catch(err) {
            if(err instanceof AxiosError) {
                const status = err.response?.status;

                switch(status) {
                    case 401:
                        toast("unauthorised, please log in again")
                        clearUser()
                        router.push("/signin")
                        break
                    default:
                        toast(err.response?.data?.message || "something went wrong, try again later");
                }
            } else{
                toast("something went wrong, try again later")
            }
        }
        setLoading(false)
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
                        onSubmit={form.handleSubmit(async (values) => {
                            await handleGenerateForm(values)
                            form.reset({ prompt: "" })
                        })}
                    />
                )}
            />
            {showPreview && (formSchema || loading) && <FormPreview id={id} schema={formSchema} onClick={onClose} loading={loading} />}
        </form>
    );

}

export default page