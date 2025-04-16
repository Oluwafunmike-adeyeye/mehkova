'use client';

import { SuccessMessage } from '@/components/checkout/SuccessMessage';
import { useEffect } from 'react';
import { useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation'; 


export default function SuccessPage() {
  
  const router = useRouter(); 

  const { clearCart } = useCartStore();

  useEffect(() => {
    clearCart();

  }, [clearCart]);

  return (
    <div className="container py-12">
      <SuccessMessage onClose={() => router.push('/')} />
    </div>
  );
}
