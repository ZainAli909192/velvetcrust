import {
  Schema,
  model,
  models,
  Types,
} from "mongoose";

const orderItemSchema =
  new Schema(
    {
      productId: {
        type: Types.ObjectId,
        ref: "Product",
        required: true,
      },

      name: {
        type: String,
        required: true,
        trim: true,
      },

      image: {
        type: String,
        default: "",
      },

      quantity: {
        type: Number,
        required: true,
        min: 1,
        max: 20,
      },

      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },

      totalPrice: {
        type: Number,
        required: true,
        min: 0,
      },
    },
    {
      _id: false,
    }
  );

const customerDetailsSchema =
  new Schema(
    {
      fullName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        maxlength: 254,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
    },
    {
      _id: false,
    }
  );

const deliveryAddressSchema =
  new Schema(
    {
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
        default: "",
        trim: true,
        maxlength: 100,
      },

      apartment: {
        type: String,
        default: "",
        trim: true,
        maxlength: 50,
      },

      notes: {
        type: String,
        default: "",
        trim: true,
        maxlength: 500,
      },
    },
    {
      _id: false,
    }
  );

const orderSchema =
  new Schema(
    {
      orderNumber: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      customerId: {
        type: Types.ObjectId,
        ref: "Customer",
        default: null,
        index: true,
      },

      checkoutType: {
        type: String,
        enum: [
          "guest",
          "customer",
        ],
        required: true,
      },

      idempotencyKey: {
        type: String,
        required: true,
        unique: true,
        index: true,
      },

      customerDetails: {
        type: customerDetailsSchema,
        required: true,
      },

      deliveryAddress: {
        type: deliveryAddressSchema,
        required: true,
      },

      items: {
        type: [orderItemSchema],
        required: true,

        validate: {
          validator: (
            items: unknown[]
          ) =>
            items.length >= 1 &&
            items.length <= 10,

          message:
            "Order must contain between 1 and 10 products.",
        },
      },

      subtotal: {
        type: Number,
        required: true,
        min: 0,
      },

      deliveryFee: {
        type: Number,
        required: true,
        min: 0,
        default: 0,
      },

      total: {
        type: Number,
        required: true,
        min: 0,
      },

      paymentMethod: {
        type: String,
        enum: [
          "card",
          "tabby",
          "tamara",
        ],
        required: true,
      },

      paymentStatus: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],
        default: "Pending",
        index: true,
      },

      paymentReference: {
        type: String,
        default: null,
      },

    status: {
  type: String,
  enum: [
    "Pending",
    "Confirmed",
    "Processing",
    "Delivered",
    "Cancelled",
  ],
  default: "Pending",
  index: true,
},

      cancelledAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: true,
    }
  );

orderSchema.index({
  customerId: 1,
  createdAt: -1,
});

const Order =
  models.Order ||
  model(
    "Order",
    orderSchema
  );

export default Order;