interface ValidationRules {
    minLength?: number;
    maxLength?: number;
}

interface FormField {
    name: string;
    label: string;
    type: FieldType;
    placeholder: string;
    required: boolean;
    defaultValue?: any;
    helpText?: string;
    options?: string[];
    validations: ValidationRules;
}

interface FormSchema {
    title: string;
    description: string;
    fields: FormField[];
}

type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "select"
  | "radio"
  | "checkbox"
  | "tags"
  | "email"
  | "file";

interface RecentFormStore {
    id: string
    schema: FormSchema
    prompt: string
}

interface RecentFormsState {
    recentForms: RecentFormStore[]
    addRecentForm: (form: RecentFormStore) => void
    removeRecentForm: (id: string) => void
    clearRecentForms: () => void
}


export type {
    FormSchema,
    RecentFormStore,
    RecentFormsState
}