import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type RateLimitType =
  | "forgot-password-ip"
  | "forgot-password-email"
  | "verify-otp-ip"
  | "order-create-ip"
  | "order-create-customer"
  | "order-cancel-ip"
  | "order-cancel-customer"
  | "password-change-ip"
  | "password-change-customer";

export interface IRateLimit
  extends Document {
  key: string;
  type: RateLimitType;
  count: number;
  windowStartedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RateLimitSchema =
  new Schema<IRateLimit>(
    {
      key: {
        type: String,
        required: true,
        trim: true,
      },

      type: {
        type: String,
        required: true,
        enum: [
          "forgot-password-ip",
          "forgot-password-email",
          "verify-otp-ip",
          "order-create-ip",
          "order-create-customer",
          "order-cancel-ip",
          "order-cancel-customer",
          "password-change-ip",
          "password-change-customer",
        ],
      },

      count: {
        type: Number,
        required: true,
        default: 1,
        min: 0,
      },

      windowStartedAt: {
        type: Date,
        required: true,
        default: Date.now,
      },

      expiresAt: {
        type: Date,
        required: true,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

RateLimitSchema.index(
  {
    key: 1,
    type: 1,
  },
  {
    unique: true,
  }
);

RateLimitSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

const RateLimit: Model<IRateLimit> =
  mongoose.models.RateLimit ||
  mongoose.model<IRateLimit>(
    "RateLimit",
    RateLimitSchema
  );

export default RateLimit;