'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useFormContext } from 'react-hook-form';
import { CheckoutFormData } from '@/types/checkout';
import { AlertCircle } from 'lucide-react';

export const ShippingForm = () => {
  const { register, formState: { errors } } = useFormContext<CheckoutFormData>();

  const FormField = ({ 
    id, 
    label, 
    required = true,
    type = 'text',
    inputMode = 'text',
    validation = {},
    className = '',
    gridSpan = 1
  }: {
    id: keyof CheckoutFormData;
    label: string;
    required?: boolean;
    type?: string;
    inputMode?: 'text' | 'numeric' | 'email';
    validation?: object;
    className?: string;
    gridSpan?: 1 | 2;
  }) => (
    <div className={`space-y-1 sm:space-y-2 ${gridSpan === 2 ? 'sm:col-span-2' : ''}`}>
      <Label htmlFor={id} className="text-xs sm:text-sm">
        {label} {required && '*'}
      </Label>
      <div className="relative">
        <Input
          id={id}
          type={type}
          inputMode={inputMode}
          {...register(id, { 
            required: required ? `${label} is required` : false,
            ...validation 
          })}
          className={`text-xs sm:text-sm ${className}`}
          autoComplete={
            id === 'email' ? 'email' :
            id === 'address' ? 'street-address' :
            id === 'city' ? 'address-level2' :
            id === 'state' ? 'address-level1' :
            id === 'zip' ? 'postal-code' : 'on'
          }
        />
        {errors[id]?.message && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <AlertCircle className="h-4 w-4 text-red-500" />
          </div>
        )}
      </div>
      {errors[id]?.message && (
        <p className="text-xs text-red-500 mt-1">{errors[id]?.message as string}</p>
      )}
    </div>
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Shipping Information</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <FormField 
          id="name" 
          label="Full Name" 
          validation={{ minLength: { value: 2, message: 'Name is too short' } }}
        />

        <FormField 
          id="email" 
          label="Email" 
          type="email"
          validation={{
            pattern: {
              value: /^\S+@\S+\.\S+$/,
              message: 'Please enter a valid email'
            }
          }}
        />

        <FormField 
          id="address" 
          label="Address" 
          gridSpan={2}
          validation={{ minLength: { value: 5, message: 'Address is too short' } }}
        />

        <FormField 
          id="city" 
          label="City" 
          validation={{ minLength: { value: 2, message: 'City name is too short' } }}
        />

        <FormField 
          id="state" 
          label="State/Province/Region" 
          validation={{ minLength: { value: 2, message: 'State name is too short' } }}
        />

        <FormField 
          id="zip" 
          label="ZIP/Postal Code" 
          inputMode="numeric"
          validation={{
            pattern: {
              value: /^[0-9-]+$/,
              message: 'Please enter a valid postal code'
            },
            minLength: {
              value: 4,
              message: 'Postal code is too short'
            }
          }}
        />
      </div>
    </div>
  );
};