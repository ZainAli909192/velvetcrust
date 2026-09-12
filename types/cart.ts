export type CartProduct = {
  id: string | number;
  name: string;
  slug: string;
  description: string;
  price: number;
  image: string;
};

export type CartItem = CartProduct & {
  quantity: number;
};