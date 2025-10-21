import { FormSchema } from "@/types/form.types"
import FormRenderer from "./FormRenderer"

interface FormCardI {
    schema: FormSchema
}

const FormCard = ({ schema }: FormCardI) => {
    return (
        <div className="relative bg-card border border-border rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-lg hover:border-primary/50">
            <div className="relative h-62 overflow-hidden bg-background">
                <div className="scale-50 origin-top-left pointer-events-none">
                    <FormRenderer schema={schema} className="w-lg" readOnly={true}/>
                </div>
            </div>

            <div className="relative p-3 bg-card text-center border-t border-border">
                <p className="font-medium text-foreground truncate">
                    {schema.title || "Untitled Form"}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                    {schema.description || "No description available"}
                </p>
            </div>
        </div>
    )
}

export default FormCard