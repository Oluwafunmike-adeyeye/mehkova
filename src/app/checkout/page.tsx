'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/auth-context';
import { useCartStore } from '@/lib/store';
import { useCheckout } from '@/hooks/useCheckout';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { PaymentMethods } from '@/components/checkout/PaymentMethods';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { CheckoutFormData } from '@/types/checkout';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen">
      <Loader2 className="h-12 w-12 animate-spin" />
    </div>}>
      <CheckoutContent />
    </Suspense>
  );
}

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useAuth();
  const { items } = useCartStore();
  const { isProcessing, processOrder, formErrors } = useCheckout();
  const [error, setError] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  const methods = useForm<CheckoutFormData>({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      paymentMethod: 'card',
    },
    mode: 'onBlur'
  });

  const onSubmit = methods.handleSubmit(async (data) => {
    setError(null);
    setIsNavigating(true);
    
    try {
      await processOrder(data);
    } catch (error) {
      setIsNavigating(false);
      console.error('Checkout error:', error);
      setError(error instanceof Error ? error.message : 'Failed to process your order');
    }
  });

  // Handle authentication and redirects
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      const redirectUrl = searchParams.get('redirect') || '/checkout';
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`);
      return;
    }

    if (items.length === 0 && !isNavigating) {
      router.push('/cart');
    }
  }, [user, authLoading, items, router, searchParams, isNavigating]);

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin" />
      </div>
    );
  }

  if (!user || (items.length === 0 && !isNavigating)) {
    return null;
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl text-primary font-bold mb-6 sm:mb-8 md:mb-10 text-center"
      >
        Secure Checkout
      </motion.h1>

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg text-center"
        >
          {error}
        </motion.div>
      )}

      {Object.keys(formErrors).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg"
        >
          <ul className="list-disc pl-5">
            {Object.entries(formErrors).map(([key, value]) => (
              <li key={key}>{value}</li>
            ))}
          </ul>
        </motion.div>
      )}

      <FormProvider {...methods}>
        <form onSubmit={onSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="p-4 sm:p-6 w-full mx-auto">
                  <ShippingForm />
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="p-4 sm:p-6 w-full mx-auto">
                  <PaymentMethods />
                </Card>
              </motion.div>
            </div>

            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <OrderSummary 
                  isProcessing={isProcessing || isNavigating}
                  onSubmit={onSubmit} 
                />
              </motion.div>
            </div>
          </div>
        </form>
      </FormProvider>
    </div>
  );
}