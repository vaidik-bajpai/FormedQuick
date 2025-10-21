import { FormSchema } from "@/types/form.types";
import { Button } from "./ui/button";
import { ExternalLink, X } from "lucide-react";
import { TextShimmer } from "./ui/text-shimmer";
import { useRouter } from 'next/navigation'
import FormRenderer from "./FormRenderer";

interface FormPreviewProps {
    id: string
    schema: FormSchema | undefined
    onClick?: () => void
    loading: boolean
}

const FormPreview = ({ id, schema, onClick, loading }: FormPreviewProps) => {
    const router = useRouter()

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