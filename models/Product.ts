import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IProduct
  extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  price: number;
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema =
  new Schema<IProduct>(
    {
      name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 150,
      },

      slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        maxlength: 180,
      },

      description: {
        type: String,
        default: "",
        trim: true,
        maxlength: 2000,
      },

      image: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500,
      },

      images: {
        type: [String],
        default: [],
      },

      price: {
        type: Number,
        required: true,
        min: 0,
      },

      isActive: {
        type: Boolean,
        default: true,
      },

      isFeatured: {
        type: Boolean,
        default: false,
      },

      sortOrder: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

ProductSchema.index({
  isActive: 1,
  sortOrder: 1,
});

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>(
    "Product",
    ProductSchema
  );

export default Product;