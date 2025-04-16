import { z } from 'zod';
import { CheckoutFormData } from "@/types/checkout";

// Schemas
const shippingSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Valid email is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(10, "Valid phone number is required").optional(),
});

const cardSchema = z.object({
  cardNumber: z.string()
    .min(16, "Enter 16-digit card number")
    .max(16, "Enter 16-digit card number"),
  cardExpiry: z.string()
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, "Use MM/YY format"),
  cardCvc: z.string()
    .min(3, "CVC must be at least 3 digits")
    .max(4, "CVC must be at most 4 digits"),
});

/**
 * Validates shipping information
 * @param data - Checkout form data
 * @returns Error message or null if valid
 */
export const validateShippingInfo = (data: CheckoutFormData): string | null => {
  try {
    shippingSchema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid shipping information";
    }
    return "Invalid shipping information";
  }
};

/**
 * Validates payment information (only if paymentMethod is 'card')
 * @param data - Checkout form data
 * @returns Error message or null if valid
 */
export const validatePaymentInfo = (data: CheckoutFormData): string | null => {
  if (data.paymentMethod !== 'card') return null;
  
  try {
    cardSchema.parse({
      cardNumber: data.cardNumber?.replace(/\s/g, ''),
      cardExpiry: data.cardExpiry,
      cardCvc: data.cardCvc
    });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || "Invalid card information";
    }
    return "Invalid card information";
  }
};

/**
 * Validates entire checkout form
 * @param data - Checkout form data
 * @returns Object with field-level errors or null if valid
 */
export const validateCheckoutForm = (data: CheckoutFormData): Record<string, string> | null => {
  const errors: Record<string, string> = {};
  
  // Validate shipping
  try {
    shippingSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      error.errors.forEach((err) => {
        errors[err.path[0]] = err.message;
      });
    }
  }

  // Validate payment if card
  if (data.paymentMethod === 'card') {
    try {
      cardSchema.parse({
        cardNumber: data.cardNumber?.replace(/\s/g, ''),
        cardExpiry: data.cardExpiry,
        cardCvc: data.cardCvc
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        error.errors.forEach((err) => {
          errors[err.path[0]] = err.message;
        });
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
};