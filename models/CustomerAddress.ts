import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type AddressLabel =
  | "Home"
  | "Office"
  | "Other";

export interface ICustomerAddress
  extends Document {
  customerId: Types.ObjectId;

  label: AddressLabel;

  emirate: string;
  area: string;
  addressLine: string;

  building?: string;
  apartment?: string;
  notes?: string;

  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const CustomerAddressSchema =
  new Schema<ICustomerAddress>(
    {
      customerId: {
        type:
          Schema.Types
            .ObjectId,

        ref: "Customer",

        required: true,

        index: true,
      },

      label: {
        type: String,

        required: true,

        enum: [
          "Home",
          "Office",
          "Other",
        ],

        default: "Home",

        trim: true,
      },

      emirate: {
        type: String,

        required: true,

        trim: true,

        maxlength: 50,
      },

      area: {
        type: String,

        required: true,

        trim: true,

        maxlength: 100,
      },

      addressLine: {
        type: String,

        required: true,

        trim: true,

        maxlength: 200,
      },

      building: {
        type: String,

        trim: true,

        maxlength: 100,

        default:
          undefined,
      },

      apartment: {
        type: String,

        trim: true,

        maxlength: 50,

        default:
          undefined,
      },

      notes: {
        type: String,

        trim: true,

        maxlength: 500,

        default:
          undefined,
      },

      isDefault: {
        type: Boolean,

        default: false,
      },
    },
    {
      timestamps: true,

      versionKey: false,
    }
  );

CustomerAddressSchema.index(
  {
    customerId: 1,
    createdAt: -1,
  }
);

const CustomerAddress: Model<ICustomerAddress> =
  mongoose.models
    .CustomerAddress ||
  mongoose.model<ICustomerAddress>(
    "CustomerAddress",
    CustomerAddressSchema
  );

export default CustomerAddress;