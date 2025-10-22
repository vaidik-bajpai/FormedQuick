"use client"

import { useRecentFormsStore } from "@/store/form.store"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import axios from "@/api/axiosInstance"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { ContextMenu, ContextMenuTrigger, ContextMenuContent, ContextMenuItem } from "@/components/ui/context-menu"
import FormCard from "@/components/FormCard"
import { toast } from "sonner"
import { AxiosError } from "axios"
import { FormSchema } from "@/types/form.types"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Copy, CopyCheck } from "lucide-react"

const PAGE_SIZE = 5

interface ActiveForm {
    _id: string
    title: string
    description: string
    formSchema: FormSchema
    prompt: string
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
    const [openAccordion, setOpenAccordion] = useState<string[]>([])
    const [copiedItem, setCopiedItem] = useState<string | null>(null)

    const router = useRouter()
    const searchParams = useSearchParams()

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

    useEffect(() => {
        const activeParam = searchParams.get("active")
        const recentParam = searchParams.get("recents")

        if (activeParam === "true") {
            setOpenAccordion(["item-2"])
            const element = document.getElementById("active-section")
            if (element) element.scrollIntoView({ behavior: "smooth" })
        } else if (recentParam === "true") {
            setOpenAccordion(["item-1"])
            const element = document.getElementById("recent-section")
            if (element) element.scrollIntoView({ behavior: "smooth" })
        } else {
            setOpenAccordion([])
        }
    }, [searchParams])

    const handleCopy = async (content: string, label: string, id: string) => {
        try {
            await navigator.clipboard.writeText(content)
            setCopiedItem(`${id}-${label}`)
            toast(`${label === "json" ? "JSON data" : "Prompt"} copied to clipboard!`)
            setTimeout(() => setCopiedItem(null), 1500)
        } catch (error) {
            toast("Failed to copy content")
        }
    }

    const totalPages = Math.ceil(totalActiveForms / PAGE_SIZE)

    return (
        <div className="grow flex">
            <div className="w-5xl mx-auto">
                <div className="text-2xl my-2 font-semibold bg-card text-foreground border-b py-3 border-border">
                    <h1>My forms</h1>
                </div>

                <Accordion type="multiple" value={openAccordion} onValueChange={setOpenAccordion}>
                    {/* Recent Forms */}
                    <AccordionItem value="item-1" id="recent-section">
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
                                            <ContextMenuItem onClick={() => router.push(`/form/${form.id}?recent=true`)}>
                                                View
                                            </ContextMenuItem>
                                            <ContextMenuItem onClick={() => removeRecentForm(form.id)}>
                                                Delete
                                            </ContextMenuItem>

                                            <ContextMenuItem
                                                onClick={() =>
                                                    handleCopy(JSON.stringify(form.schema, null, 2), "json", form.id)
                                                }
                                                className="flex justify-between items-center"
                                            >
                                                Copy JSON
                                                {copiedItem === `${form.id}-json` ? (
                                                    <CopyCheck size={16} className="text-green-500" />
                                                ) : (
                                                    <Copy size={16} className="text-muted-foreground" />
                                                )}
                                            </ContextMenuItem>

                                            <ContextMenuItem
                                                onClick={() =>
                                                    handleCopy(`${form.prompt}`, "prompt", form.id)
                                                }
                                                className="flex justify-between items-center"
                                            >
                                                Copy Prompt
                                                {copiedItem === `${form.id}-prompt` ? (
                                                    <CopyCheck size={16} className="text-green-500" />
                                                ) : (
                                                    <Copy size={16} className="text-muted-foreground" />
                                                )}
                                            </ContextMenuItem>
                                        </ContextMenuContent>
                                    </ContextMenu>
                                ))
                            ) : (
                                <div>No recent forms found</div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Active Forms */}
                    <AccordionItem value="item-2" id="active-section">
                        <AccordionTrigger className="text-xl cursor-pointer font-medium hover:text-primary">
                            Active ({totalActiveForms})
                        </AccordionTrigger>
                        <AccordionContent className="flex justify-center flex-wrap gap-2">
                            {loadingActive ? (
                                <div>Loading active forms...</div>
                            ) : activeForms.length > 0 ? (
                                <>
                                    <div className="flex justify-center flex-wrap gap-2">
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
                                                    <ContextMenuItem onClick={() => router.push(`/form/${form.publicId}`)}>
                                                        View
                                                    </ContextMenuItem>
                                                    <ContextMenuItem onClick={() => router.push(`/submissions/${form.publicId}`)}>Submissions</ContextMenuItem>

                                                    <ContextMenuItem
                                                        onClick={() =>
                                                            handleCopy(JSON.stringify(form.formSchema, null, 2), "json", form._id)
                                                        }
                                                        className="flex justify-between items-center"
                                                    >
                                                        Copy JSON
                                                        {copiedItem === `${form._id}-json` ? (
                                                            <CopyCheck size={16} className="text-green-500" />
                                                        ) : (
                                                            <Copy size={16} className="text-muted-foreground" />
                                                        )}
                                                    </ContextMenuItem>

                                                    <ContextMenuItem
                                                        onClick={() =>
                                                            handleCopy(`${form.prompt}`, "prompt", form._id)
                                                        }
                                                        className="flex justify-between items-center"
                                                    >
                                                        Copy Prompt
                                                        {copiedItem === `${form._id}-prompt` ? (
                                                            <CopyCheck size={16} className="text-green-500" />
                                                        ) : (
                                                            <Copy size={16} className="text-muted-foreground" />
                                                        )}
                                                    </ContextMenuItem>

                                                    <ContextMenuItem>Delete</ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        ))}
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <Pagination>
                                            <PaginationContent className="justify-center mt-4">
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            if (currentPage > 1) setCurrentPage((p) => p - 1)
                                                        }}
                                                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>

                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                setCurrentPage(pageNum)
                                                            }}
                                                            isActive={currentPage === pageNum}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}

                                                {totalPages > 5 && currentPage < totalPages - 2 && (
                                                    <PaginationItem>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                )}

                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={(e) => {
                                                            e.preventDefault()
                                                            if (currentPage < totalPages) setCurrentPage((p) => p + 1)
                                                        }}
                                                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
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
