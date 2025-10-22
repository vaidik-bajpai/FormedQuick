"use client"

import { useState, useEffect, use } from "react"
import axios from "@/api/axiosInstance"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, PaginationEllipsis } from "@/components/ui/pagination"
import { toast } from "sonner"
import { AxiosError } from "axios"
import FormRenderer from "@/components/FormRenderer"
import { FormSchema } from "@/types/form.types"
import { Textarea } from "@/components/ui/textarea"

const PAGE_SIZE = 5

interface Submission {
    _id: string
    user: string
    responses: {
        name: string
        value: string | number | boolean | string[] | null
        fileUrl?: string
    }[]
    submittedAt: string
}

interface SubmissionsResponse {
    data: {
        formSchema: FormSchema
        submissions: Submission[]
        meta: {
            total: number
            page: number
            pageSize: number
            totalPages: number
        }
    }
}

const Page = ({ params }: { params: Promise<{ formID: string }> }) => {
    const { formID } = use(params)
    const [formSchema, setFormSchema] = useState<FormSchema | null>(null)
    const [submissions, setSubmissions] = useState<Submission[]>([])
    const [totalSubmissions, setTotalSubmissions] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [meta, setMeta] = useState({ page: 1, pageSize: PAGE_SIZE, totalPages: 1, total: 0 })

    // Accordion control
    const [openAccordion, setOpenAccordion] = useState<string[]>(["item-1"])

    // Fetch submissions and schema
    const fetchSubmissions = async (page: number = 1) => {
        setLoading(true)
        try {
            const response = await axios.get<SubmissionsResponse>(`/submissions/list/${formID}`, {
                params: { page, pageSize: PAGE_SIZE },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`,
                },
            })

            const { formSchema, submissions, meta } = response.data.data
            setFormSchema(formSchema)
            setSubmissions(submissions)
            setTotalSubmissions(meta.total)
            setMeta(meta)
        } catch (err) {
            if (err instanceof AxiosError) {
                toast(err.response?.data?.message || "Failed to fetch submissions")
            } else {
                toast("Failed to fetch submissions")
            }
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubmissions(currentPage)
    }, [currentPage, formID])

    const totalPages = meta.totalPages

    // Render one submission as a code block/editor
    const renderSubmission = (sub: Submission, idx: number) => (
        <div key={sub._id} className="mb-4 rounded border border-border p-2 bg-card">
            <div className="mb-2 text-sm text-muted-foreground">
                <span>Submission #{(meta.page - 1) * PAGE_SIZE + idx + 1} · </span>
                <span>{new Date(sub.submittedAt).toLocaleString()}</span>
            </div>
            <Textarea
                disabled
                value={JSON.stringify(
                    sub.responses.map(r => ({
                        field: r.name,
                        value: r.fileUrl ? r.fileUrl : r.value
                    })),
                    null,
                    2
                )}
            />
        </div>
    )

    return (
        <div className="grow flex">
            <div className="w-5xl mx-auto">
                <div className="text-2xl my-2 font-semibold bg-card text-foreground border-b py-3 border-border">
                    <h1>Form & Submissions</h1>
                </div>

                <Accordion type="multiple" value={openAccordion} onValueChange={setOpenAccordion}>
                    {/* Form Preview */}
                    <AccordionItem value="item-1" id="form-section">
                        <AccordionTrigger className="text-xl cursor-pointer font-medium hover:text-primary">
                            Form Preview
                        </AccordionTrigger>
                        <AccordionContent>
                            {!formSchema ? (
                                <div>Loading...</div>
                            ) : (
                                <div className="mb-4">
                                    <FormRenderer
                                        formID={formID}
                                        schema={formSchema}
                                        readOnly
                                        className="mb-6"
                                    />
                                    <div className="text-md mt-2">
                                        <div>
                                            <span className="font-semibold">Title: </span>
                                            {formSchema.title}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Description: </span>
                                            {formSchema.description}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Submission count: </span>
                                            {totalSubmissions}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>

                    {/* Submissions */}
                    <AccordionItem value="item-2" id="submissions-section">
                        <AccordionTrigger className="text-xl cursor-pointer font-medium hover:text-primary">
                            Submissions ({totalSubmissions})
                        </AccordionTrigger>
                        <AccordionContent>
                            {loading ? (
                                <div>Loading submissions...</div>
                            ) : submissions.length > 0 ? (
                                <>
                                    {submissions.map(renderSubmission)}

                                    {/* Pagination for submissions */}
                                    {totalPages > 1 && (
                                        <Pagination>
                                            <PaginationContent className="justify-center mt-4">
                                                <PaginationItem>
                                                    <PaginationPrevious
                                                        href="#"
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            if (meta.page > 1) setCurrentPage((p) => p - 1)
                                                        }}
                                                        className={meta.page === 1 ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
                                                    <PaginationItem key={pageNum}>
                                                        <PaginationLink
                                                            href="#"
                                                            onClick={e => {
                                                                e.preventDefault()
                                                                setCurrentPage(pageNum)
                                                            }}
                                                            isActive={meta.page === pageNum}
                                                        >
                                                            {pageNum}
                                                        </PaginationLink>
                                                    </PaginationItem>
                                                ))}
                                                <PaginationItem>
                                                    <PaginationNext
                                                        href="#"
                                                        onClick={e => {
                                                            e.preventDefault()
                                                            if (meta.page < totalPages) setCurrentPage((p) => p + 1)
                                                        }}
                                                        className={meta.page === totalPages ? "pointer-events-none opacity-50" : ""}
                                                    />
                                                </PaginationItem>
                                            </PaginationContent>
                                        </Pagination>
                                    )}
                                </>
                            ) : (
                                <div>No submissions found</div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default Page
