"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useCart } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { toast } from 'sonner'
import Image from 'next/image'
import { Suspense } from 'react'

export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <CartContent />
    </Suspense>
  )
}


function CartContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { 
    cartItems: items, 
    removeFromCart, 
    updateCartItemQuantity, 
    cartTotal: total 
  } = useCart()
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  // Handle authentication and redirects
  useEffect(() => {
    if (!loading && !user) {
      const redirectUrl = searchParams.get('redirect') || '/cart'
      router.push(`/auth/login?redirect=${encodeURIComponent(redirectUrl)}`)
    }
  }, [user, loading, router, searchParams])

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please login to checkout')
      router.push(`/auth/login?redirect=${encodeURIComponent('/checkout')}`)
      return
    }
    setIsCheckingOut(true)
    router.push('/checkout')
  }

  const handleDecreaseQuantity = (item: typeof items[0]) => {
    const newQuantity = Math.max(1, item.quantity - 1)
    updateCartItemQuantity(
      item.id,
      newQuantity,
      { color: item.color, size: item.size }
    )
  }

  const handleIncreaseQuantity = (item: typeof items[0]) => {
    updateCartItemQuantity(
      item.id,
      item.quantity + 1,
      { color: item.color, size: item.size }
    )
  }

  const handleRemoveItem = (item: typeof items[0]) => {
    removeFromCart(
      item.id,
      { color: item.color, size: item.size }
    )
    toast.success('Item removed from cart')
  }

  // Loading state
  if (loading) {
    return (
      <div className="container py-8 sm:py-12 text-center px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground animate-pulse" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="container py-8 sm:py-12 text-center px-4 sm:px-6">
        <div className="flex flex-col items-center justify-center space-y-4">
          <ShoppingCart className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
          <h1 className="text-xl sm:text-2xl font-bold">Your Cart is Empty</h1>
          <p className="text-muted-foreground">Add some items to your cart to get started</p>
          <Link href="/products" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  // Main cart UI
  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-12 text-center text-primary"
      >
        Your Shopping Cart
      </motion.h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          {items.map((item, index) => (
            <motion.div
              key={`${item.id}-${item.color || ''}-${item.size || ''}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-3 sm:p-4">
                <div className="flex flex-col xs:flex-row items-center gap-3 sm:gap-4">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      sizes="(max-width: 768px) 96px, 96px"
                      priority={index < 3}
                    />
                  </div>
                  <div className="flex-1 min-w-0 w-full xs:w-auto">
                    <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">
                      ₦{item.price.toLocaleString()}
                    </p>
                    {item.color && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Color: {item.color}
                      </p>
                    )}
                    {item.size && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Size: {item.size}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 w-full xs:w-auto justify-between xs:justify-normal">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        <Minus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                      <span className="w-6 sm:w-8 text-center text-sm sm:text-base">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 sm:h-9 sm:w-9"
                        onClick={() => handleIncreaseQuantity(item)}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                      </Button>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 sm:h-9 sm:w-9 text-destructive hover:text-destructive"
                      onClick={() => handleRemoveItem(item)}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Order Summary</h2>
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Subtotal ({items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
                  <span>₦{total().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base">
                  <span>Shipping</span>
                  <span>₦2,000</span>
                </div>
                <div className="border-t pt-3 sm:pt-4 font-bold text-base sm:text-lg">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span>₦{(total() + 2000).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <Button
                className="w-full text-sm sm:text-base"
                onClick={handleCheckout}
                disabled={isCheckingOut}
                size="sm"
              >
                {isCheckingOut ? 'Redirecting...' : 'Proceed to Checkout'}
              </Button>
              <Link href="/products" className="block mt-3 sm:mt-4">
                <Button variant="outline" className="w-full text-sm sm:text-base" size="sm">
                  Continue Shopping
                </Button>
              </Link>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}