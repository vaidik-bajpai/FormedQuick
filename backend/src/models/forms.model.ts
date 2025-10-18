import mongoose, { Schema, Document } from "mongoose";

interface IForm {
  user: mongoose.Types.ObjectId;         
  title: string;                         
  description?: string;                  
  schema: Record<string, any>;           
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
    schema: {
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
