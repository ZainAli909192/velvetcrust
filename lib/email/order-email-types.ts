export type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

export type OrderEmailData = {
  orderNumber: string;

  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };

  deliveryAddress: {
    emirate: string;
    area: string;
    addressLine: string;
    building?: string;
    apartment?: string;
    notes?: string;
  };

  items: OrderEmailItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentMethod: string;

  paymentStatus?: string;

  status?: string;

  paymentReference?: string;

  cancelledAt?:
    | Date
    | string
    | null;
};