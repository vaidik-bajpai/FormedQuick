import React, { useState } from 'react'
import { FormSchema } from '@/types/form.types'
import FormHeader from '@/components/FormHeader'
import { Input } from '@/components/ui/input'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import FormDescription from './FormDescription'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { buildZodSchema } from "@/lib/zod.lib";
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import axios from '../api/axiosInstance'
import z from 'zod'
import { toast } from 'sonner'
import { AxiosError } from 'axios'
import { useUserStore } from '@/store/user.store'
import { useRouter } from 'next/navigation'

interface FormRendererI {
    formID: string
    schema: FormSchema
    className?: string
    readOnly?: boolean
}

const FormRenderer = ({ formID, schema, className, readOnly }: FormRendererI) => {
    const zodSchema = React.useMemo(() => buildZodSchema(schema), [schema]);
    const [loading, setLoading] = useState<boolean>(false);
    const [responseSubmitted, setResponseSubmitted] = useState<boolean>(false);
    const clearUser = useUserStore((state) => state.clearUser)
    const router = useRouter()
    
    const form = useForm({
        resolver: !readOnly ? zodResolver(zodSchema) : undefined,
        mode: "onSubmit",
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = form;

    const onSubmit = async (values: Record<string, any>) => {
        setLoading(true);
        try {
            const formData = new FormData();
            console.log('[DEBUG] Schema:', schema);
            schema.fields.forEach((field) => {
                const { name, type } = field;
                const value = values[name];
                console.log(`[DEBUG] Field: ${name} | Type: ${type} | Value:`, value);

                if (type === "file" && value) {
                    if (value instanceof FileList || Array.isArray(value)) {
                        if (value.length > 0) formData.append(name, value[0]);
                    } else if (value instanceof File) {
                        formData.append(name, value);
                    }
                } else if (value !== undefined && value !== null) {
                    formData.append(name, String(value));
                }
            });

            console.log('[DEBUG] FormData keys:', Array.from(formData.keys()));
            for (let key of formData.keys()) {
                const val = formData.get(key);
                console.log(`[DEBUG] FormData entry for "${key}":`, val);
            }

            const response = await axios.post(`/submissions/submit/${formID}`, formData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("form-gen-access-token")}`,
                },
            });

            setResponseSubmitted(true);
            toast("your response has been submitted");
        } catch (err) {
            console.error('[DEBUG] Submission error:', err);
            if (err instanceof AxiosError) {
                const status = err.response?.status;
                switch (status) {
                    case 401:
                        toast("Unauthorized, please log in again");
                        clearUser();
                        router.push("/signin");
                        break;
                    case 404:
                        toast("Form not found");
                        break;
                    default:
                        toast(err.response?.data?.message || "Failed to submit form");
                }
            } else {
                toast("Something went wrong while submitting the form");
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className={`z-2 w-full max-w-5xl bg-card border border-border rounded-xl p-6 flex flex-col gap-4 text-foreground max-h-[80%] overflow-y-auto ${className}`}
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
                <Button type="submit" size="lg" disabled={loading} className="bg-secondary text-secondary-foreground font-bold">
                    Submit
                </Button>
            )}
        </form>
    );
}

export default FormRenderer