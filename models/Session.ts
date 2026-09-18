import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export interface ISession
  extends Document {
  customerId: Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema =
  new Schema<ISession>(
    {
      customerId: {
        type:
          Schema.Types
            .ObjectId,

        ref: "Customer",

        required: true,

        index: true,
      },

      tokenHash: {
        type: String,

        required: true,

        unique: true,

        select: false,
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

SessionSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

const Session: Model<ISession> =
  mongoose.models.Session ||
  mongoose.model<ISession>(
    "Session",
    SessionSchema
  );

export default Session;