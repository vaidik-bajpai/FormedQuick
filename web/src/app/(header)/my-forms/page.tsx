"use client"

import FormCard from "@/components/FormCard"
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu"
import { useRecentFormsStore } from "@/store/form.store"
import { useRouter } from "next/navigation"

const page = () => {
    const recentForms = useRecentFormsStore((state) => state.recentForms)
    const removeRecentForm = useRecentFormsStore((state) => state.removeRecentForm)
    const router = useRouter()

    return (
        <div className="grow flex">
            <div className="w-5xl mx-auto">
                <Accordion type="multiple">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl cursor-pointer font-mediumhover:text-primary">
                            Recents ({recentForms.length}/5)
                        </AccordionTrigger>
                        <AccordionContent className="flex justify-center flex-wrap gap-2">
                            {
                                recentForms.length > 0 ? 
                                    recentForms.map((form) => {
                                        return (
                                            <ContextMenu>
                                                <ContextMenuTrigger>
                                                    <div
                                                        onClick={() => router.push(`/form/${form.id}?recent=true`)}
                                                        className="max-w-64 overflow-hidden cursor-pointer"
                                                    >
                                                        <FormCard schema={form.schema}/>
                                                    </div>
                                                </ContextMenuTrigger>
                                                <ContextMenuContent>
                                                    <ContextMenuItem onClick={() => router.push(`/form/${form.id}?recent=true`)}>View</ContextMenuItem>
                                                    <ContextMenuItem onClick={() => removeRecentForm(form.id)}>Delete</ContextMenuItem>
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        )
                                    })
                                : <div>No recent forms found</div>
                            }
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger className="text-xl cursor-pointer font-mediumhover:text-primary">
                            Active
                        </AccordionTrigger>
                        <AccordionContent>
                            You don't have any saved forms
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </div>
    )
}

export default page