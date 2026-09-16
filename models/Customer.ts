import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type AuthProvider =
  | "credentials"
  | "google"
  | "apple";

export interface ICustomer
  extends Document {
  name: string;
  email: string;
  phone?: string;

  passwordHash?: string;

  providers: AuthProvider[];

  googleId?: string;
  appleId?: string;

  emailVerified: boolean;
  isActive: boolean;

  passwordResetOtpHash?: string | null;
  passwordResetOtpExpires?: Date | null;
  passwordResetOtpAttempts: number;

  passwordResetVerifiedAt?: Date | null;

  passwordResetTokenHash?: string | null;
  passwordResetTokenExpires?: Date | null;

  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema =
  new Schema<ICustomer>(
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
        unique: true,
        trim: true,
        lowercase: true,
        maxlength: 254,
        index: true,
      },

      phone: {
        type: String,
        trim: true,
        maxlength: 20,
        default: undefined,
      },

      passwordHash: {
        type: String,
        select: false,
        default: undefined,
      },

      providers: {
        type: [String],
        enum: [
          "credentials",
          "google",
          "apple",
        ],
        required: true,
        default: [],
      },

      googleId: {
        type: String,
        select: false,
        default: undefined,
      },

      appleId: {
        type: String,
        select: false,
        default: undefined,
      },

      emailVerified: {
        type: Boolean,
        default: false,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      passwordResetOtpHash: {
        type: String,
        default: null,
        select: false,
      },

      passwordResetOtpExpires: {
        type: Date,
        default: null,
        select: false,
      },

      passwordResetOtpAttempts: {
        type: Number,
        default: 0,
        select: false,
      },

      passwordResetVerifiedAt: {
        type: Date,
        default: null,
        select: false,
      },

      passwordResetTokenHash: {
        type: String,
        default: null,
        select: false,
      },

      passwordResetTokenExpires: {
        type: Date,
        default: null,
        select: false,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

CustomerSchema.index(
  {
    googleId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

CustomerSchema.index(
  {
    appleId: 1,
  },
  {
    unique: true,
    sparse: true,
  }
);

CustomerSchema.set(
  "toJSON",
  {
    transform: (_doc, ret) => {
      delete ret.passwordHash;
      delete ret.googleId;
      delete ret.appleId;

      delete ret.passwordResetOtpHash;
      delete ret.passwordResetOtpExpires;
      delete ret.passwordResetOtpAttempts;
      delete ret.passwordResetVerifiedAt;
      delete ret.passwordResetTokenHash;
      delete ret.passwordResetTokenExpires;

      return ret;
    },
  }
);

const Customer: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>(
    "Customer",
    CustomerSchema
  );

export default Customer;