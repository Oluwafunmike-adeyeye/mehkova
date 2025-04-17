// hooks/useCheckout.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store';
import { CheckoutFormData } from '@/types/checkout';
import { validateShippingInfo, validatePaymentInfo } from '@/lib/validation';

interface MockPaymentResponse {
  success: boolean;
  orderId?: string;
  error?: string;
}

const simulatePayment = async (): Promise<MockPaymentResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Randomly fail 10% of the time for demo purposes
  const shouldFail = Math.random() < 0.1;
  
  if (shouldFail) {
    return {
      success: false,
      error: 'Payment processor declined transaction'
    };
  }

  return { 
    success: true, 
    orderId: `ord_${Math.random().toString(36).substring(2, 10)}`
  };
};

export const useCheckout = () => {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: CheckoutFormData) => {
    const errors: Record<string, string> = {};
    
    // Your existing validation logic
    const shippingError = validateShippingInfo(formData);
    if (shippingError) errors.shipping = shippingError;

    if (formData.paymentMethod === 'card') {
      const paymentError = validatePaymentInfo(formData);
      if (paymentError) errors.payment = paymentError;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const processOrder = async (formData: CheckoutFormData) => {
    if (!validateForm(formData)) return false;

    setIsProcessing(true);

    try {
      const paymentResult = await simulatePayment();
      
      if (!paymentResult.success) {
        throw new Error(paymentResult.error || 'Payment processing failed');
      }

      // Show success message
      toast.success('Order completed successfully!');
      
      // Clear cart silently (without triggering another toast)
      clearCart({ silent: true });
      
      // Redirect to success page
      router.push(`/checkout/success?order_id=${paymentResult.orderId}`);
      
      return true;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An unexpected error occurred');
      }
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return { 
    isProcessing,
    formErrors,
    processOrder,
    validateForm
  };
};