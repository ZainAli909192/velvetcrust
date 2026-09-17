export type CheckoutDetails = {
  fullName: string;
  email: string;
  phone: string;
  emirate: string;
  area: string;
  addressLine: string;
  building: string;
  apartment: string;
  notes: string;
};

export const emptyCheckoutDetails: CheckoutDetails = {
  fullName: "",
  email: "",
  phone: "",
  emirate: "",
  area: "",
  addressLine: "",
  building: "",
  apartment: "",
  notes: "",
};