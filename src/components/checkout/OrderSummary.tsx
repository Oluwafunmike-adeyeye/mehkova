'use client';

import { useCartStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatPrice } from '@/lib/formatters';
import { ArrowLeft, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type OrderSummaryProps = {
  isProcessing: boolean;
  onSubmit: () => void;
};

export const OrderSummary = ({ isProcessing, onSubmit }: OrderSummaryProps) => {
  const { items, total } = useCartStore();
  const shippingCost = 5000; // $50.00 in cents
  const orderTotal = total() + shippingCost;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Card className="p-4 sm:p-6 sticky top-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Order Summary</h2>
      
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <div className="flex justify-between text-sm sm:text-base">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span>{formatPrice(total())}</span>
        </div>
        
        <div className="flex justify-between text-sm sm:text-base">
          <span>Shipping</span>
          <span>{formatPrice(shippingCost)}</span>
        </div>
        
        <div className="border-t pt-3 sm:pt-4 font-bold text-base sm:text-lg">
          <div className="flex justify-between">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Button
          className="w-full text-sm sm:text-base"
          onClick={onSubmit}
          disabled={isProcessing}
          size="sm"
          aria-label={isProcessing ? "Processing your order" : "Complete your order"}
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
              Processing Payment
            </>
          ) : (
            <>
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Complete Order
            </>
          )}
        </Button>
        
        <Link href="/cart" passHref legacyBehavior>
          <Button 
            variant="outline" 
            className="w-full text-sm sm:text-base mt-4" 
            size="sm"
            disabled={isProcessing}
          >
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
            Back to Cart
          </Button>
        </Link>
      </div>

      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
        <h3 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Your Items</h3>
        <div className="space-y-3 max-h-48 sm:max-h-64 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 sm:gap-3">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover rounded"
                  sizes="(max-width: 640px) 40px, 48px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatPrice(item.price)} × {item.quantity}
                </p>
              </div>
              <p className="text-xs sm:text-sm font-medium whitespace-nowrap">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};