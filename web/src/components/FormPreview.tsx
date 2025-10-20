import FormDescription from "./FormDescription"
import FormHeader from "./FormHeader"
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { FormSchema } from "@/types/form";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FormPreviewProps {
    schema: FormSchema
    onClick?: () => void
}

const FormPreview = ({ schema, onClick }: FormPreviewProps) => {
    if (!schema) return null;

    return (
        <div className="fixed inset-0 flex flex-col justify-center items-center z-3 backdrop-blur">
            {/* Top Close Button */}
            <div className="flex justify-end w-5xl px-4 mt-2 space-x-4">
                <Button
                    size="icon"
                    className="bg-secondary text-secondary-foreground mb-2"
                    onClick={onClick}
                >
                    <X />
                </Button>
            </div>

            <form className="w-5xl bg-card border border-border rounded-xl p-4 flex flex-col gap-1 text-foreground max-h-[80%] overflow-y-auto">
                {/* Header */}
                <div className="mb-2">
                    <FormHeader headerText={schema.title} />
                    <FormDescription description={schema.description} />
                </div>

                {/* Dynamic Fields */}
                {schema.fields.map((field) => {
                    const commonProps = {
                        id: field.name,
                        name: field.name,
                        placeholder: field.placeholder,
                        required: field.required,
                        defaultValue: field.defaultValue,
                    };

                    const labelText = (
                        <label
                            htmlFor={field.name}
                            className="block mb-1 text-sm font-medium"
                        >
                            {field.label}
                            {field.required && "*"}
                        </label>
                    );

                    switch (field.type) {
                        case "text":
                        case "email":
                        return (
                            <div key={field.name} className="mb-4">
                            {labelText}
                            <Input
                                type={field.type}
                                minLength={field.validations?.minLength}
                                maxLength={field.validations?.maxLength}
                                {...commonProps}
                            />
                            {field.helpText && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {field.helpText}
                                </p>
                            )}
                            </div>
                        );

                        case "select":
                        return (
                            <div key={field.name} className="mb-4">
                            {labelText}
                            <Select defaultValue={field.defaultValue}>
                                <SelectTrigger>
                                    <SelectValue placeholder={field.placeholder} />
                                </SelectTrigger>
                                <SelectContent>
                                    {field.options?.map((option) => (
                                        <SelectItem key={option} value={option}>
                                        {option}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {field.helpText && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    {field.helpText}
                                </p>
                            )}
                            </div>
                        );

                        case "checkbox":
                        return (
                            <fieldset key={field.name} className="mb-4">
                                <legend className="block mb-1 text-sm font-medium">
                                    {field.label}
                                    {field.required && "*"}
                                </legend>
                                {field.options?.map((option, idx) => (
                                    <div key={idx} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`${field.name}-${idx}`}
                                        name={field.name}
                                        value={option}
                                        required={field.required}
                                    />
                                    <label
                                        htmlFor={`${field.name}-${idx}`}
                                        className="text-sm"
                                    >
                                        {option}
                                    </label>
                                    </div>
                                ))}
                                {field.helpText && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                    {field.helpText}
                                    </p>
                                )}
                            </fieldset>
                        );

                        // Add support for more field types if needed
                        default:
                            return null;
                    }
                })}

                <Button size="lg" className="bg-secondary text-secondary-foreground">
                Submit
                </Button>
            </form>

            {/* Bottom Buttons */}
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
        </div>
    );
};

export default FormPreview