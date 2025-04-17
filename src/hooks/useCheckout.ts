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
  await new Promise(resolve => setTimeout(resolve, 1500));
  const shouldFail = Math.random() < 0.1;
  
  return shouldFail 
    ? { success: false, error: 'Payment processor declined transaction' }
    : { success: true, orderId: `ord_${Math.random().toString(36).substring(2, 10)}` };
};

export const useCheckout = () => {
  const router = useRouter();
  const { clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: CheckoutFormData) => {
    const errors: Record<string, string> = {};
    
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

      clearCart({ silent: true });
      
      // Redirect first and wait for it to complete
      await router.push(`/checkout/success?order_id=${paymentResult.orderId}`);
      
      // Only show toast after navigation is complete
      toast.success('Order completed successfully!');
      
      return true;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Payment failed');
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