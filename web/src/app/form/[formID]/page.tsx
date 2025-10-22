"use client"

import { useRecentFormsStore } from '@/store/form.store'
import { FormSchema } from '@/types/form.types'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { use, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { TextShimmer } from '@/components/ui/text-shimmer'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import axios from '@/api/axiosInstance'
import { useUserStore } from '@/store/user.store'
import FormRenderer from '@/components/FormRenderer'

interface FormPageI {
    formID: string
}

const Page = ({ params }: { params: Promise<FormPageI> }) => {
    const { formID } = use(params)
    const [prompt, setPrompt] = useState<string>("")
    const searchParams = useSearchParams()
    const recent = searchParams.get("recent") === "true"

    const recentForms = useRecentFormsStore((state) => state.recentForms)
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
    const [loading, setLoading] = useState(true)

    const router = useRouter()
    const clearUser = useUserStore((state) => state.clearUser)

    async function handleFormFetch(formID: string) {
        setLoading(true)
        try {
            const response = await axios.get(`/form/get/${formID}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`
                }
            })
            const fetchedForm: FormSchema = response.data.data.form.formSchema
            setFormSchema(fetchedForm)
            console.log("Fetched form from server:", fetchedForm)
        } catch (err) {
            if (err instanceof AxiosError) {
                const status = err.response?.status
                switch (status) {
                    case 401:
                        toast("Unauthorized, please log in again")
                        clearUser()
                        router.push("/signin")
                        break
                    case 404:
                        toast("Form not found")
                        break
                    default:
                        toast(err.response?.data?.message || "Failed to fetch form")
                }
            } else {
                toast("Something went wrong while fetching the form")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (recent) {
            const found = recentForms.find((form) => form.id === formID)
            if (found) {
                setFormSchema(found.schema)
                setPrompt(found.prompt)
                console.log('Loaded recent form:', found)
                setLoading(false)
            } else {
                console.warn('No recent form found for ID:', formID)
                handleFormFetch(formID)
            }
        } else {
            handleFormFetch(formID)
        }
    }, [recent, formID, recentForms])

    async function handleSave(prompt: string, form: FormSchema) {
        console.log("handle save called: ", prompt, formSchema)
        try {
            const response = await axios.post("/form/save", {
                prompt, 
                form
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`
                    }
                }
            )

            toast("form created successfully")
            router.push(`/form/${response.data.data.formID}`)
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
    }

    const handleExport = () => {
        if (!formSchema) {
            toast("No form schema available to export")
            return
        }
        try {
            const dataStr = JSON.stringify(formSchema, null, 2)
            const blob = new Blob([dataStr], { type: "application/json" })
            const url = URL.createObjectURL(blob)

            const anchor = document.createElement("a")
            anchor.href = url
            anchor.download = `${formID}-formSchema.json`
            document.body.appendChild(anchor)
            anchor.click()

            document.body.removeChild(anchor)
            URL.revokeObjectURL(url)

            toast("Export initiated")
        } catch (error) {
            toast("Failed to export form schema")
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <TextShimmer duration={1.2} className="text-2xl">
                    Loading form...
                </TextShimmer>
            </div>
        )
    }

    if (!formSchema) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-muted-foreground text-lg">
                    No form found.
                </p>
            </div>
        )
    }

    return (
        <div className="relative flex flex-col justify-center items-center py-8 px-4 min-h-screen">
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
            
            <FormRenderer 
                formID={formID}
                schema={formSchema}
            />

            {recent && <div className="flex z-2 justify-end w-5xl px-4 mt-4 space-x-4">
                <Button
                    size="lg"
                    className="bg-primary text-primary-foreground font-semibold"
                    onClick={() => handleSave(prompt, formSchema)}
                >
                    Save
                </Button>
                <Button
                    variant="outline"
                    size="lg"
                    className="bg-secondary text-secondary-foreground border-border font-medium cursor-pointer"
                    onClick={handleExport}
                >
                    Export
                </Button>
            </div>}
        </div>
    )
}

export default Page
