import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();

    const products =
      await Product.find({
        isActive: true,
      })
        .select(
          "_id name slug description image price"
        )
        .sort({
          sortOrder: 1,
          createdAt: 1,
        })
        .lean();

    const safeProducts =
      products.map(
        (product) => ({
          id: product._id.toString(),
          name: product.name,
          slug: product.slug,
          description:
            product.description,
          image: product.image,
          price: product.price,
        })
      );

    return NextResponse.json({
      success: true,
      products: safeProducts,
    });
  } catch (error) {
    console.error(
      "Get products error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load products.",
      },
      {
        status: 500,
      }
    );
  }
}