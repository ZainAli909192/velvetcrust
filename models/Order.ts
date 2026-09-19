import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type PaymentMethod =
  | "card"
  | "apple_pay"
  | "google_pay"
  | "tabby"
  | "tamara";

export type PaymentStatus =
  | "Pending"
  | "Paid"
  | "Failed"
  | "Refunded";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Processing"
  | "Delivered"
  | "Cancelled";

export type CheckoutType =
  | "guest"
  | "customer";

export interface IOrderItem {
  productId: Types.ObjectId;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface IOrderCustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}

export interface IOrderDeliveryAddress {
  emirate: string;
  area: string;
  addressLine: string;
  building?: string;
  apartment?: string;
  notes?: string;
}

export interface IOrder
  extends Document {
  orderNumber: string;

  customerId?:
    | Types.ObjectId
    | null;

  checkoutType:
    CheckoutType;

  idempotencyScope:
    string;

  idempotencyKey:
    string;

  guestAccessTokenHash?:
    | string
    | null;

  customerDetails:
    IOrderCustomerDetails;

  deliveryAddress:
    IOrderDeliveryAddress;

  items:
    IOrderItem[];

  subtotal: number;

  deliveryFee: number;

  total: number;

  paymentMethod:
    PaymentMethod;

  paymentStatus:
    PaymentStatus;

  paymentReference?:
    string | null;

  status:
    OrderStatus;

  cancelledAt?:
    Date | null;

  deliveredAt?:
    Date | null;

  customerConfirmationEmailSentAt?:
    Date | null;

  customerConfirmationEmailClaimedAt?:
    Date | null;

  ownerConfirmationEmailSentAt?:
    Date | null;

  ownerConfirmationEmailClaimedAt?:
    Date | null;

  createdAt: Date;

  updatedAt: Date;
}

const orderItemSchema =
  new Schema<IOrderItem>(
    {
      productId: {
        type:
          Schema.Types
            .ObjectId,

        ref:
          "Product",

        required:
          true,
      },

      name: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          160,
      },

      image: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          1000,
      },

      quantity: {
        type:
          Number,

        required:
          true,

        min:
          1,

        max:
          20,
      },

      unitPrice: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },

      totalPrice: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },
    },
    {
      _id:
        false,
    }
  );

const customerDetailsSchema =
  new Schema<IOrderCustomerDetails>(
    {
      fullName: {
        type:
          String,

        required:
          true,

        trim:
          true,

        minlength:
          2,

        maxlength:
          80,
      },

      email: {
        type:
          String,

        required:
          true,

        trim:
          true,

        lowercase:
          true,

        maxlength:
          254,
      },

      phone: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          20,
      },
    },
    {
      _id:
        false,
    }
  );

const deliveryAddressSchema =
  new Schema<IOrderDeliveryAddress>(
    {
      emirate: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          80,
      },

      area: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          120,
      },

      addressLine: {
        type:
          String,

        required:
          true,

        trim:
          true,

        maxlength:
          300,
      },

      building: {
        type:
          String,

        trim:
          true,

        maxlength:
          120,

        default:
          undefined,
      },

      apartment: {
        type:
          String,

        trim:
          true,

        maxlength:
          80,

        default:
          undefined,
      },

      notes: {
        type:
          String,

        trim:
          true,

        maxlength:
          500,

        default:
          undefined,
      },
    },
    {
      _id:
        false,
    }
  );

const orderSchema =
  new Schema<IOrder>(
    {
      orderNumber: {
        type:
          String,

        required:
          true,

        unique:
          true,

        trim:
          true,

        index:
          true,
      },

      customerId: {
        type:
          Schema.Types
            .ObjectId,

        ref:
          "Customer",

        default:
          null,

        index:
          true,
      },

      checkoutType: {
        type:
          String,

        enum: [
          "guest",
          "customer",
        ],

        required:
          true,
      },

      idempotencyScope: {
        type:
          String,

        required:
          true,

        index:
          true,
      },

      idempotencyKey: {
        type:
          String,

        required:
          true,
      },

      guestAccessTokenHash: {
        type:
          String,

        default:
          null,

        select:
          false,
      },

      customerDetails: {
        type:
          customerDetailsSchema,

        required:
          true,
      },

      deliveryAddress: {
        type:
          deliveryAddressSchema,

        required:
          true,
      },

      items: {
        type: [
          orderItemSchema,
        ],

        required:
          true,

        validate: {
          validator(
            items:
              IOrderItem[]
          ) {
            return (
              Array.isArray(
                items
              ) &&
              items.length >=
                1 &&
              items.length <=
                10
            );
          },

          message:
            "Order must contain between 1 and 10 items.",
        },
      },

      subtotal: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },

      deliveryFee: {
        type:
          Number,

        required:
          true,

        min:
          0,

        default:
          0,
      },

      total: {
        type:
          Number,

        required:
          true,

        min:
          0,
      },

      paymentMethod: {
        type:
          String,

        enum: [
          "card",
          "apple_pay",
          "google_pay",
          "tabby",
          "tamara",
        ],

        required:
          true,
      },

      paymentStatus: {
        type:
          String,

        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],

        required:
          true,

        default:
          "Pending",

        index:
          true,
      },

      paymentReference: {
        type:
          String,

        trim:
          true,

        default:
          null,

        index:
          true,
      },

      status: {
        type:
          String,

        enum: [
          "Pending",
          "Confirmed",
          "Processing",
          "Delivered",
          "Cancelled",
        ],

        required:
          true,

        default:
          "Pending",

        index:
          true,
      },

      cancelledAt: {
        type:
          Date,

        default:
          null,
      },

      deliveredAt: {
        type:
          Date,

        default:
          null,
      },

      customerConfirmationEmailSentAt: {
        type:
          Date,

        default:
          null,
      },

      customerConfirmationEmailClaimedAt: {
        type:
          Date,

        default:
          null,
      },

      ownerConfirmationEmailSentAt: {
        type:
          Date,

        default:
          null,
      },

      ownerConfirmationEmailClaimedAt: {
        type:
          Date,

        default:
          null,
      },
    },
    {
      timestamps:
        true,

      versionKey:
        false,
    }
  );

orderSchema.index(
  {
    idempotencyScope:
      1,

    idempotencyKey:
      1,
  },
  {
    unique:
      true,
  }
);

orderSchema.index({
  customerId:
    1,

  createdAt:
    -1,
});

const Order:
  Model<IOrder> =
    mongoose.models
      .Order ||
    mongoose.model<IOrder>(
      "Order",
      orderSchema
    );

export default Order;