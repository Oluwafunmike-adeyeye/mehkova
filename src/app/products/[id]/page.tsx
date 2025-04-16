"use client"

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useCart } from '@/lib/store'  
import { Minus, Plus, ShoppingCart, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { Suspense } from 'react'


export default function CartPage() {
  return (
    <Suspense fallback={<div>Loading cart...</div>}>
      <ProductContent />
    </Suspense>
  )
}

interface Product {
  id: number
  name: string
  price: number
  description: string
  image: string
  images?: string[]
  category: string
  colors?: string[]
  sizes?: string[]
  inStock?: boolean
  stock?: number
  rating?: number
  specifications?: Record<string, string>
}

interface ProductData {
  products: Product[]
  categories: {
    id: number
    name: string
    displayName: string
  }[]
}

interface CartItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
  color?: string
  size?: string
}

function ProductContent() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined)
  const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined)
  const [currentImage, setCurrentImage] = useState<string>('')
  const { addToCart } = useCart()

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const fetchProduct = async () => {
      try {
        setLoading(true)
        setError(null)
        
        if (!params?.id) {
          throw new Error('No product ID provided')
        }

        const productId = Number(params.id)
        if (isNaN(productId)) {
          throw new Error('Invalid product ID')
        }

        const response = await fetch('/mehkova.json', { signal })
        if (!response.ok) throw new Error('Failed to fetch products')
        
        const data: ProductData = await response.json()
        const foundProduct = data.products.find((p) => p.id === productId)
        
        if (!foundProduct) {
          throw new Error(`Product with ID ${productId} not found`)
        }

        setProduct(foundProduct)
        setCurrentImage(foundProduct.image)
        if (foundProduct.colors?.length) {
          setSelectedColor(foundProduct.colors[0])
        }
        if (foundProduct.sizes?.length) {
          setSelectedSize(foundProduct.sizes[0])
        }

      } catch (err: unknown) {
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            console.error('Error:', err)
            setError(err.message)
            toast.error(err.message)
          }
        } else {
          const errorMessage = 'An unknown error occurred'
          setError(errorMessage)
          toast.error(errorMessage)
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchProduct()
    return () => controller.abort()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return
    
    if (product.inStock === false) {
      toast.error('This product is out of stock')
      return
    }

    if (product.stock && quantity > product.stock) {
      toast.error(`Only ${product.stock} items available`)
      return
    }

    const cartItem: CartItem = {
      id: product.id,
      title: product.name,
      price: product.price,
      image: product.image,
      quantity,
      ...(selectedColor && { color: selectedColor }),
      ...(selectedSize && { size: selectedSize })
    }

    addToCart(cartItem)
  }

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change
    if (product?.stock && newQuantity > product.stock) {
      toast.info(`Maximum available quantity is ${product.stock}`)
      setQuantity(product.stock)
    } else if (newQuantity < 1) {
      setQuantity(1)
    } else {
      setQuantity(newQuantity)
    }
  }

  if (loading) {
    return (
      <div className="container py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-full animate-pulse" />
            <div className="h-4 bg-gray-100 rounded w-2/3 animate-pulse" />
            <div className="h-6 bg-gray-100 rounded w-1/4 animate-pulse mt-4" />
            <div className="h-10 bg-gray-100 rounded w-full animate-pulse mt-8" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container py-8 sm:py-12 px-4 sm:px-6 text-center">
        <h1 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
          {error || 'Product Not Found'}
        </h1>
        <p className="mb-4 text-sm sm:text-base">ID: {params.id || 'None'}</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
          <Button onClick={() => router.push('/products')}>
            Browse Products
          </Button>
        </div>
      </div>
    )
  }

  const allImages = product.images ? [product.image, ...product.images] : [product.image]

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <nav className="text-sm mb-6 flex items-center gap-2 text-muted-foreground">
        <Link href="/" className="hover:text-primary">Home</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-primary">Products</Link>
        <span>/</span>
        <span className="text-foreground line-clamp-1">{product.name}</span>
      </nav>

      <Card className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div>
            <div className="relative aspect-square mb-3 rounded-lg overflow-hidden">
              <Image
                src={currentImage}
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              {product.rating && (
                <div className="absolute top-2 left-2 bg-background/90 px-2 py-1 rounded-md flex items-center gap-1 text-sm">
                  ★ {product.rating.toFixed(1)}
                </div>
              )}
              {product.inStock === false && (
                <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs sm:text-sm">
                  Out of Stock
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide">
                {allImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentImage(img)}
                    className={`shrink-0 relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                      currentImage === img ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <Image
                      src={img}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2">
              {product.name}
            </h1>
            
            {product.category && (
              <p className="text-sm text-muted-foreground mb-3">
                Category: {product.category}
              </p>
            )}

            <p className="text-muted-foreground text-sm sm:text-base mb-4 sm:mb-6">
              {product.description}
            </p>

            <p className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
              ₦{product.price.toLocaleString()}
            </p>

            {product.stock && (
              <p className="text-sm text-muted-foreground mb-4">
                {product.stock} items left in stock
              </p>
            )}

            {product.colors && product.colors.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-2">Color: {selectedColor}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`relative h-6 w-6 rounded-full border-2 ${
                        selectedColor === color ? 'border-primary' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      aria-label={`Select color ${color}`}
                      title={color}
                    >
                      {selectedColor === color && (
                        <span className="absolute inset-0 flex items-center justify-center text-white">
                          ✓
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.sizes && product.sizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-2">Size: {selectedSize}</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      className="min-w-[40px]"
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={product.inStock === false || quantity <= 1}
                  className="h-10 w-10 p-0"
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="font-medium w-8 text-center">{quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuantityChange(1)}
                  disabled={
                    product.inStock === false || 
                    (product.stock ? quantity >= product.stock : false)
                  }
                  className="h-10 w-10 p-0"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.stock && (
                <span className="text-sm text-muted-foreground">
                  Max: {product.stock}
                </span>
              )}
            </div>

            <Button
              size="lg"
              className="w-full gap-2"
              onClick={handleAddToCart}
              disabled={product.inStock === false}
            >
              <ShoppingCart className="h-5 w-5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>

            {product.specifications && (
              <div className="mt-8 pt-6 border-t">
                <h3 className="text-lg font-bold mb-3">Specifications</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="space-y-1">
                      <p className="text-muted-foreground capitalize">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}