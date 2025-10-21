"use client"

import { useRecentFormsStore } from "@/store/form.store"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import axios from "@/api/axiosInstance"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import FormCard from "@/components/FormCard"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { FormSchema } from "@/types/form.types"

const PAGE_SIZE = 5
interface ActiveForm {
    _id: string
    title: string
    description: string
    formSchema: FormSchema
    publicId: string
    createdAt: string
}

interface FormsResponse {
    data: {
        forms: ActiveForm[]
        meta: {
            total: number
            page: number
            pageSize: number
            totalPages: number
        }
    }
}

const Page = () => {
    const recentForms = useRecentFormsStore((state) => state.recentForms)
    const removeRecentForm = useRecentFormsStore((state) => state.removeRecentForm)

    const [activeForms, setActiveForms] = useState<ActiveForm[]>([])
    const [totalActiveForms, setTotalActiveForms] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingActive, setLoadingActive] = useState(true)

    const router = useRouter()

    const fetchActiveForms = async (page: number = 1) => {
        setLoadingActive(true)
        try {
            const response = await axios.get<FormsResponse>("/form/list", {
                params: { page, pageSize: PAGE_SIZE },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`,
                },
            })

            const { forms, meta } = response.data.data

            setActiveForms(forms)
            setTotalActiveForms(meta.total)
        } catch (err) {
            if (err instanceof AxiosError) {
                toast(err.response?.data?.message || "Failed to fetch active forms")
            } else {
                toast("Failed to fetch active forms")
            }
        } finally {
            setLoadingActive(false)
        }
    }

    useEffect(() => {
        fetchActiveForms(currentPage)
    }, [currentPage])

    const totalPages = Math.ceil(totalActiveForms / PAGE_SIZE)

    return (
        <div className="grow flex">
            <div className="w-5xl mx-auto">
                <Accordion type="multiple">
                    {/* Recent Forms */}
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl cursor-pointer font-medium hover:text-primary">
                            Recents ({recentForms.length}/5)
                        </AccordionTrigger>
                        <AccordionContent className="flex justify-center flex-wrap gap-2">
                            {recentForms.length > 0 ? (
                                recentForms.map((form) => (
                                    <ContextMenu key={form.id}>
                                        <ContextMenuTrigger>
                                            <div
                                                onClick={() => router.push(`/form/${form.id}?recent=true`)}
                                                className="max-w-64 overflow-hidden cursor-pointer"
                                            >
                                                <FormCard schema={form.schema} />
                                            </div>
                                        </ContextMenuTrigger>
                                        <ContextMenuContent>
                                            <ContextMenuItem onClick={() => router.push(`/form/${form.id}?recent=true`)}>View</ContextMenuItem>
                                            <ContextMenuItem onClick={() => removeRecentForm(form.id)}>Delete</ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            ) : (
                                <div>No recent forms found</div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Active Forms */}
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl cursor-pointer font-medium hover:text-primary">
                            Active ({totalActiveForms})
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2">
                            {loadingActive ? (
                                <div>Loading active forms...</div>
                            ) : activeForms.length > 0 ? (
                                <>
                                    <div className="flex flex-wrap gap-2">
                                        {activeForms.map((form) => (
                                            <ContextMenu key={form._id}>
                                                <ContextMenuTrigger>
                                                    <div
                                                        onClick={() => router.push(`/form/${form.publicId}`)}
                                                        className="max-w-64 overflow-hidden cursor-pointer"
                                                    >
                                                        <FormCard schema={form.formSchema} />
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem onClick={() => router.push(`/form/${form.publicId}`)}>View</ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        ))}
                                    </div>

                                    {totalPages > 1 && (
                                        <div className="flex justify-center gap-2 mt-4">
                                            <button
                                                disabled={currentPage === 1}
                                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                                className="px-3 py-1 border rounded"
                                            >
                                                Prev
                                            </button>
                                            <span className="px-3 py-1">{currentPage} / {totalPages}</span>
                                            <button
                                                disabled={currentPage === totalPages}
                                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                                className="px-3 py-1 border rounded"
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div>You don't have any saved forms</div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default Page
