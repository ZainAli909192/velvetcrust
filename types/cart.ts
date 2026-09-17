export type CartProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
};

export type CartItem =
  CartProduct & {
    quantity: number;
  };