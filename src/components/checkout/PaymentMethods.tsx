'use client';

import { useState, useEffect, useRef } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CreditCard } from 'lucide-react';
import { CheckoutFormData, PaymentMethod } from '@/types/checkout';

export const PaymentMethods = () => {
  const { 
    register, 
    control, 
    setValue, 
    formState: { errors } 
  } = useFormContext<CheckoutFormData>();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const cardNumberRef = useRef<HTMLInputElement>(null);
  
  const cardNumber = useWatch({ control, name: 'cardNumber' });
  const cardExpiry = useWatch({ control, name: 'cardExpiry' });

  // Handle cursor position for card number
  useEffect(() => {
    if (cardNumberRef.current) {
      const cursorPosition = cardNumberRef.current.selectionStart;
      const newCursorPosition = cursorPosition 
        ? calculateNewCursorPosition(cardNumber || '', cursorPosition)
        : null;
      
      requestAnimationFrame(() => {
        if (cardNumberRef.current && newCursorPosition !== null) {
          cardNumberRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
        }
      });
    }
  }, [cardNumber]);

  const calculateNewCursorPosition = (value: string, oldPos: number): number => {
    const spacesBefore = value.substring(0, oldPos).match(/\s/g)?.length || 0;
    return oldPos + spacesBefore;
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const parts = [];
    for (let i = 0; i < v.length && i < 16; i += 4) {
      parts.push(v.substring(i, Math.min(i + 4, v.length)));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatCardNumber(input);
    setValue('cardNumber', formatted, { shouldValidate: true });
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatExpiryDate(input);
    setValue('cardExpiry', formatted, { shouldValidate: true });
  };

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    setValue('paymentMethod', method, { shouldValidate: true });
    
    // Clear card fields when switching to PayPal
    if (method === 'paypal') {
      setValue('cardNumber', '', { shouldValidate: false });
      setValue('cardExpiry', '', { shouldValidate: false });
      setValue('cardCvc', '', { shouldValidate: false });
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Payment Method</h2>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Button
          type="button"
          variant={paymentMethod === 'card' ? 'default' : 'outline'}
          onClick={() => handlePaymentMethodChange('card')}
          className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
        >
          <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
          <span>Credit Card</span>
        </Button>

        <Button
          type="button"
          variant={paymentMethod === 'paypal' ? 'default' : 'outline'}
          onClick={() => handlePaymentMethodChange('paypal')}
          className="text-xs sm:text-sm"
        >
          PayPal
        </Button>
      </div>

      {paymentMethod === 'card' && (
        <div className="space-y-3 sm:space-y-4">
          <div className="space-y-1">
            <Label htmlFor="cardNumber" className="text-xs sm:text-sm">Card Number *</Label>
            <Input
              id="cardNumber"
              ref={cardNumberRef}
              placeholder="1234 5678 9012 3456"
              value={cardNumber || ''}
              onChange={handleCardNumberChange}
              onKeyDown={(e) => {
                // Prevent spacebar and non-numeric input
                if ((e.key === ' ' || isNaN(Number(e.key))) && 
                    e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'Delete') {
                  e.preventDefault();
                }
              }}
              maxLength={19}
              error={errors.cardNumber?.message}
              inputMode="numeric"
              className="text-xs sm:text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1">
              <Label htmlFor="cardExpiry" className="text-xs sm:text-sm">Expiry Date *</Label>
              <Input
                id="cardExpiry"
                placeholder="MM/YY"
                value={cardExpiry || ''}
                onChange={handleExpiryChange}
                onKeyDown={(e) => {
                  if ((e.key === ' ' || isNaN(Number(e.key))) && 
                      e.key !== 'Backspace' && e.key !== 'Tab' && e.key !== 'Delete' && e.key !== '/') {
                    e.preventDefault();
                  }
                }}
                maxLength={5}
                error={errors.cardExpiry?.message}
                inputMode="numeric"
                className="text-xs sm:text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="cardCvc" className="text-xs sm:text-sm">CVC *</Label>
              <Input
                id="cardCvc"
                placeholder="123"
                type="password"
                maxLength={4}
                {...register('cardCvc', {
                  required: 'CVC is required',
                  minLength: {
                    value: 3,
                    message: 'CVC must be 3-4 digits'
                  },
                  maxLength: {
                    value: 4,
                    message: 'CVC must be 3-4 digits'
                  },
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: 'Must be numeric'
                  }
                })}
                error={errors.cardCvc?.message}
                inputMode="numeric"
                className="text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'paypal' && (
        <div className="bg-muted p-3 sm:p-4 rounded-lg">
          <p className="text-xs sm:text-sm">
            You'll be redirected to PayPal to complete your purchase securely.
          </p>
        </div>
      )}
    </div>
  );
};