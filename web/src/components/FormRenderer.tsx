import React from 'react'
import { FormSchema } from '@/types/form.types'
import FormHeader from '@/components/FormHeader'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import FormDescription from './FormDescription'
import { Button } from './ui/button'
interface FormRendererI {
    schema: FormSchema
    className?: string
    readOnly?: boolean
}

const FormRenderer = ({ schema, className, readOnly }: FormRendererI) => {
    return (
        <form 
            className={`w-5xl bg-card border border-border rounded-xl p-4 flex flex-col gap-1 text-foreground max-h-[80%] overflow-y-auto " + ${className}`}
            onSubmit={(e) => readOnly && e.preventDefault()}
        >
            <div className="mb-2">
                <FormHeader headerText={schema.title} />
                <FormDescription description={schema.description} />
            </div>

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
                    
                    default:
                        return null;
                }
            })}

            <Button size="lg" className="bg-secondary text-secondary-foreground font-bold">
                Submit
            </Button>
        </form>
    )
}

export default FormRenderer