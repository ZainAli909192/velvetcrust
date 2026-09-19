import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type CollaborationStatus =
  | "pending"
  | "contacted"
  | "accepted"
  | "rejected";

export interface ICollaboration extends Document {
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;

  status: CollaborationStatus;
  adminNotes?: string;

  createdAt: Date;
  updatedAt: Date;
}

const CollaborationSchema =
  new Schema<ICollaboration>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 80,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        index: true,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },

      type: {
        type: String,
        required: true,
        trim: true,
        maxlength: 80,
      },

      message: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000,
      },

      status: {
        type: String,
        enum: [
          "pending",
          "contacted",
          "accepted",
          "rejected",
        ],
        default: "pending",
        index: true,
      },

      adminNotes: {
        type: String,
        trim: true,
        maxlength: 2000,
        default: undefined,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    },
  );

CollaborationSchema.index({
  status: 1,
  createdAt: -1,
});

const Collaboration: Model<ICollaboration> =
  mongoose.models.Collaboration ||
  mongoose.model<ICollaboration>(
    "Collaboration",
    CollaborationSchema,
  );

export default Collaboration;