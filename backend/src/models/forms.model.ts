import mongoose, { Schema, Document } from "mongoose";

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

interface ValidationRules {
  minLength?: number;
  maxLength?: number;
  regex?: string
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
  validations?: ValidationRules;
}

export interface FormSchema {
  title: string;
  description?: string;
  fields: FormField[];
}

export interface IForm extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  formSchema: FormSchema; // now stored as Mixed
  publicId: string;
  isPublic: boolean;
  tags?: string[];
  submissionCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const formSchema = new Schema<IForm>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    // Use Mixed type for dynamic nested object
    formSchema: {
      type: Schema.Types.Mixed,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    submissionCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

formSchema.pre("save", function (next) {
  if (!this.publicId) {
    this.publicId = new mongoose.Types.ObjectId().toString();
  }
  next();
});

export const Form = mongoose.model<IForm>("Form", formSchema);
