import mongoose, { Schema, Document } from "mongoose";
import type { IForm } from "./forms.model.js";

export interface FieldResponse {
  name: string;
  value: string | number | boolean | string[] | null;
  fileUrl?: string;
}

export interface IFormSubmission extends Document {
  form: mongoose.Types.ObjectId | IForm;
  formPublicId: string;
  user?: mongoose.Types.ObjectId;
  responses: FieldResponse[];
  submittedAt: Date;
  metadata?: Record<string, any>;
}

const formSubmissionSchema = new Schema<IFormSubmission>(
  {
    form: { type: Schema.Types.ObjectId, ref: "Form", required: true, index: true },
    formPublicId: { type: String, required: true, index: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: false, index: true },
    responses: [
      {
        name: { type: String, required: true },
        value: { type: Schema.Types.Mixed, required: false, default: null },
        fileUrl: { type: String },
      },
    ],
    metadata: { type: Schema.Types.Mixed, default: {} },
    submittedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

formSubmissionSchema.post("save", async function (doc, next) {
  await mongoose.model("Form").findByIdAndUpdate(doc.form, { $inc: { submissionCount: 1 } });
  next();
});

export const FormSubmission = mongoose.model<IFormSubmission>(
  "FormSubmission",
  formSubmissionSchema
);
