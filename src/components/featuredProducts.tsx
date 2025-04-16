"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Heart } from 'lucide-react'

interface Product {
  id: number
  name: string
  category: string
  price: number
  image: string
  rating: number
  colors: string[]
  isNew?: boolean
  onSale?: boolean
}

const featuredProducts: Product[] = [
  {
    "id": 51,
    "name": "Matte Liquid Lipstick Set",
    "category": "makeup",
    "price": 9500,
    "image": "https://i.pinimg.com/474x/b4/cc/95/b4cc95a797436a0faa8f750631eca909.jpg",
    "rating": 4.7,
    "colors": ["red", "nude", "berry", "pink", "brown", "mauve"],
    "isNew": true
  },
  {
    "id": 14,
    "name": "Men's Formal Suit",
    "category": "fashion",
    "price": 45000,
    "image": "https://i.pinimg.com/736x/c2/d1/eb/c2d1eb5ad3a204d2f06627d9e0f97905.jpg",
    "rating": 4.8,
    "colors": ["black", "navy", "gray"],
    "onSale": true
  },
  {
    "id": 31,
    "name": "Diamond Tennis Bracelet",
    "category": "jewelry",
    "price": 65000,
    "image": "https://i.pinimg.com/474x/4e/46/8c/4e468c46f9e2110280c2f22c57308168.jpg",
    "rating": 4.9,
    "colors": ["white gold", "yellow gold"]
  },
  {
    "id": 42,
    "name": "Women's Leather Jacket",
    "category": "fashion",
    "price": 35000,
    "image": "https://i.pinimg.com/474x/13/38/f5/1338f5807af5e35a4ce7f8076076736c.jpg",
    "rating": 4.7,
    "colors": ["black", "brown"]
  },
  {
    "id": 3,
    "name": "Pearl Necklace",
    "category": "jewelry",
    "price": 15000,
    "image": "https://i.pinimg.com/474x/6e/9b/a0/6e9ba04e1e5ed585f99aa2dae437cf73.jpg",
    "rating": 4.8,
    "colors": ["white", "cream"],
    "isNew": true
  },
  {
    "id": 30,
    "name": "Women's Sneakers",
    "category": "fashion",
    "price": 16000,
    "image": "https://i.pinimg.com/736x/77/62/79/776279edbfa6172040c6d9ae1d16edcc.jpg",
    "rating": 4.6,
    "colors": ["white", "pink", "black"],
    "onSale": true
  },
  {
    "id": 54,
    "name": "Eyeshadow Palette",
    "category": "makeup",
    "price": 11000,
    "image": "https://i.pinimg.com/474x/f8/cb/60/f8cb603fc6c3c341ce08a31802b8fe8e.jpg",
    "rating": 4.9,
    "colors": ["neutral", "warm", "cool"],
  },
  {
    "id": 48,
    "name": "Men's Watch",
    "category": "fashion",
    "price": 30000,
    "image": "https://i.pinimg.com/474x/9c/69/e9/9c69e9839557aa8a454045eb97cf395f.jpg",
    "rating": 4.7,
    "colors": ["silver", "black"]
  }
]

export function FeaturedProducts() {
  return (
    <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "0px 0px -50px 0px" }}
          className="text-center mb-8 sm:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-primary">
            Featured Products
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Discover our premium selection of fashion and jewelry
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -5 }}
              className="relative"
            >
              {/* Wishlist Button */}
              <button 
                className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary/10 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart className="h-4 w-4" />
              </button>

              {/* Sale/New Badge */}
              {product.onSale && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  SALE
                </div>
              )}
              {product.isNew && !product.onSale && (
                <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                  NEW
                </div>
              )}

              <Card className="overflow-hidden group h-full flex flex-col border-border">
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    priority={i < 4}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute top-2 left-2 flex items-center bg-background px-1.5 py-0.5 rounded-full">
                    <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400 mr-0.5 sm:mr-1" />
                    <span className="text-xs font-medium">{product.rating}</span>
                  </div>
                </div>
                <div className="p-3 sm:p-4 flex-1 flex flex-col">
                  <h3 className="font-semibold text-sm sm:text-base md:text-lg mb-1 sm:mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-3">
                    {product.colors.map(color => (
                      <span 
                        key={color} 
                        className="w-3 h-3 sm:w-4 sm:h-4 rounded-full border border-muted"
                        aria-label={color}
                        title={color}
                      />
                    ))}
                  </div>
                  <p className="text-base sm:text-lg font-bold mb-3 sm:mb-4">
                    ₦{product.price.toLocaleString()}
                    {product.onSale && (
                      <span className="ml-2 text-sm text-red-500 line-through">
                        ₦{(product.price * 1.2).toLocaleString()}
                      </span>
                    )}
                  </p>
                  <Link 
                    href={`/products/${product.id}`}
                    className="mt-auto"
                    aria-label={`View ${product.name}`}
                  >
                    <Button className="w-full text-xs sm:text-sm">
                      View Product
                    </Button>
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8 sm:mt-12 md:mt-16"
        >
          <Link href="/products" passHref>
            <Button 
              size="sm" 
              variant="outline" 
              className="border-2 border-primary text-primary font-semibold text-sm sm:text-base hover:bg-primary/10"
            >
              View All Products
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  )
}