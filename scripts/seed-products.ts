import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function seedProducts() {
  try {
    const {
      connectDB,
    } = await import(
      "@/lib/mongodb"
    );

    const {
      default: Product,
    } = await import(
      "@/models/Product"
    );

    await connectDB();

    const products = [
      {
        name:
          "Blueberry Cheese cake",
        slug:
          "blueberry-velvet",
        description:
          "Creamy · Fruity · Irresistible",
        image:
          "/images/cheesecakes/blueberry1.png",
        images: [],
        price: 120,
        isActive: true,
        isFeatured: true,
        sortOrder: 1,
      },
      {
        name:
          "Strawberry cheese cake",
        slug:
          "strawberry-bliss",
        description:
          "Fresh · Creamy · Sweet",
        image:
          "/images/cheesecakes/strawberry.png",
        images: [],
        price: 125,
        isActive: true,
        isFeatured: true,
        sortOrder: 2,
      },
      {
        name:
          "Lemon cheese cake",
        slug:
          "lemon-cheese-cake",
        description:
          "Smooth · Rich · Timeless",
        image:
          "/images/cheesecakes/lemon-cheesecake.png",
        images: [],
        price: 110,
        isActive: true,
        isFeatured: true,
        sortOrder: 3,
      },
    ];

    await Product.deleteMany({});

    const createdProducts =
      await Product.insertMany(
        products
      );

    console.log(
      "\nProducts seeded successfully:\n"
    );

    for (
      const product of createdProducts
    ) {
      console.log(
        `${product.name}: ${product._id.toString()}`
      );
    }

    process.exit(0);
  } catch (error) {
    console.error(
      "Product seed failed:",
      error
    );

    process.exit(1);
  }
}

void seedProducts();