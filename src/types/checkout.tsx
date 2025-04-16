export interface CartItem {
    id: string;
    title: string;
    price: number;
    quantity: number;
    image: string;
  }
  
  export interface CheckoutFormData {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    paymentMethod: 'card' | 'paypal' | 'bankTransfer';
    cardNumber?: string;
    cardExpiry?: string;
    cardCvc?: string;
  }
  
  export type PaymentMethod = 'card' | 'paypal';