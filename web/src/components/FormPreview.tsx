import { FormSchema } from "@/types/form.types";
import { Button } from "./ui/button";
import { ExternalLink, X } from "lucide-react";
import { TextShimmer } from "./ui/text-shimmer";
import { useRouter } from 'next/navigation'
import FormRenderer from "./FormRenderer";
import { useRecentFormsStore } from "@/store/form.store";
import axios from "../api/axiosInstance";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useUserStore } from "@/store/user.store";
import { useState } from "react";
import CoverScreenModal from "./CoverScreenModal";

interface FormPreviewProps {
    id: string
    schema: FormSchema | undefined
    onClick?: () => void
    loading: boolean
}

const FormPreview = ({ id, schema, onClick, loading }: FormPreviewProps) => {
    const [saving, setSaving] = useState(false)
    const router = useRouter()
    const recentForms = useRecentFormsStore((state) => state.recentForms)
    const clearUser = useUserStore((state) => state.clearUser)
    const prompt = recentForms.find((form) => form.id === id)?.prompt
    if(!prompt) {
        return null
    }

    async function handleSave(prompt: string, form: FormSchema) {
        setSaving(true)
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

            setSaving(false)
            toast("form created successfully")
            router.push(`/form/${response.data.data.formID}`)
        } catch(err) {
            setSaving(false)
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

    if(saving) {
        return <CoverScreenModal text="Saving form..."/>
    }

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-3 backdrop-blur">
            {
                loading ? 
                    <TextShimmer duration={1} className="text-2xl">
                        Generating form...
                    </TextShimmer> :

                    schema && <>
                        <div className="flex justify-end w-5xl px-4 mt-2 space-x-4">
                            <Button
                                size="icon"
                                className="!bg-primary !text-primary-foreground"
                                onClick={() => router.push(`/form/${id}?recent=true`)}
                            >
                                <ExternalLink />
                            </Button>
                            <Button
                                size="icon"
                                className="!bg-secondary !text-secondary-foreground mb-2"
                                onClick={onClick}
                            >
                                <X />
                            </Button>
                        </div>

                        <FormRenderer schema={schema}/>

                        <div className="flex justify-end w-5xl px-4 mt-2 space-x-4">
                            <Button
                                size="lg"
                                className="bg-primary text-primary-foreground font-semibold"
                                onClick={() => handleSave(prompt, schema)}
                                disabled={saving}
                            >
                                Save
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-secondary text-secondary-foreground border-border font-medium"
                            >
                                Export
                            </Button>
                        </div>
                    </>
            }
            
        </div>
    );
};

export default FormPreview