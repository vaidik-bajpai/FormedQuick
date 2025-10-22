import React from 'react'
import { FormSchema } from '@/types/form.types'
import FormHeader from '@/components/FormHeader'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import FormDescription from './FormDescription'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { buildZodSchema } from "@/lib/zod.lib";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

interface FormRendererI {
    schema: FormSchema
    className?: string
    readOnly?: boolean
}

const FormRenderer = ({ schema, className, readOnly }: FormRendererI) => {
    const zodSchema = React.useMemo(() => buildZodSchema(schema), [schema]);

    const form = useForm({
        resolver: !readOnly ? zodResolver(zodSchema) : undefined,
        mode: "onSubmit",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = React.useCallback((data: any, event?: React.BaseSyntheticEvent) => {
        event?.preventDefault(); // ✅ Always prevent default browser reload
        try {
            if (readOnly) return;
            console.log("✅ Form submitted successfully:", data);
        } catch (err) {
            console.error("❌ Form submission error:", err);
        }
    }, [readOnly]);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`w-full max-w-5xl bg-card border border-border rounded-xl p-6 flex flex-col gap-4 text-foreground max-h-[80%] overflow-y-auto ${className}`}
        >
            <div className="mb-4">
                <FormHeader headerText={schema.title} />
                <FormDescription description={schema.description} />
            </div>

            {schema.fields.map((field) => {
                const { name, type, label, placeholder, required, options, helpText } = field;

                const errorMessage = errors[name]?.message as string | undefined;

                switch (type) {
                    case "text":
                    case "email":
                    case "number":
                    case "file":
                        return (
                            <div key={name} className="flex flex-col gap-2">
                                <Label htmlFor={name}>
                                    {label} {required && "*"}
                                </Label>
                                <Input
                                    type={type}
                                    id={name}
                                    placeholder={placeholder}
                                    disabled={readOnly}
                                    {...register(name)}
                                />
                                {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
                                {errorMessage && (
                                    <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                                )}
                            </div>
                        );

                    case "textarea":
                        return (
                            <div key={name} className="flex flex-col gap-2">
                                <Label htmlFor={name}>
                                    {label} {required && "*"}
                                </Label>
                                <Textarea
                                    id={name}
                                    placeholder={placeholder}
                                    disabled={readOnly}
                                    {...register(name)}
                                />
                                {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
                                {errorMessage && (
                                    <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                                )}
                            </div>
                        );

                    case "select":
                        return (
                            <div key={name} className="flex flex-col gap-2">
                                <Label htmlFor={name}>
                                    {label} {required && "*"}
                                </Label>
                                <Select
                                    onValueChange={(val) => form.setValue(name, val)}
                                    defaultValue={field.defaultValue}
                                    disabled={readOnly}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {options?.map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {helpText && <p className="text-xs text-muted-foreground">{helpText}</p>}
                                {errorMessage && (
                                    <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                                )}
                            </div>
                        );

                    case "date":
                        return (
                            <div key={name} className="flex flex-col gap-2">
                                <Label htmlFor={name}>
                                    {label} {required && "*"}
                                </Label>
                                <Input
                                    type="date"
                                    id={name}
                                    disabled={readOnly}
                                    {...register(name)}
                                />
                                {errorMessage && (
                                    <p className="text-sm text-red-500 font-medium">{errorMessage}</p>
                                )}
                            </div>
                        );

                    default:
                        return null;
                }
            })}

            {!readOnly && (
                <Button type="submit" size="lg" className="bg-secondary text-secondary-foreground font-bold">
                    Submit
                </Button>
            )}
        </form>
    );
}

export default FormRenderer