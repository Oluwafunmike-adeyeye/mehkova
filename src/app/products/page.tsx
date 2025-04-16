"use client"

import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

interface Product {
  id: number
  name: string
  price: number
  image: string
  category: string
}

const PRODUCTS_PER_PAGE = 8
const VISIBLE_PAGES = 3

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await fetch('/mehkova.json')
        if (!response.ok) throw new Error('Network response was not ok')
        const data = await response.json()
        setProducts(data.products || [])
        setFilteredProducts(data.products || [])
      } catch (err) {
        console.error('Error loading products:', err)
        setError('Failed to load products. Please try again later.')
        toast.error('Failed to load products')
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchProducts, 300)
    return () => clearTimeout(timer)
  }, [])

  // Filter products based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredProducts(products)
      setCurrentPage(1)
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredProducts(filtered)
      setCurrentPage(1)
    }
  }, [searchQuery, products])

  // Memoized calculations for pagination
  const { paginatedProducts, totalPages, pageRange } = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE)

    // Calculate visible page range
    let startPage = Math.max(1, currentPage - Math.floor(VISIBLE_PAGES / 2))
    const endPage = Math.min(totalPages, startPage + VISIBLE_PAGES - 1)
    
    if (endPage - startPage + 1 < VISIBLE_PAGES) {
      startPage = Math.max(1, endPage - VISIBLE_PAGES + 1)
    }

    const pageRange = Array.from(
      { length: endPage - startPage + 1 },
      (_, i) => startPage + i
    )

    return { paginatedProducts, totalPages, pageRange }
  }, [filteredProducts, currentPage])

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6 text-center" aria-busy="true">
        <div className="animate-pulse space-y-4">
          <div className="h-8 sm:h-10 w-1/2 sm:w-1/3 mx-auto bg-gray-200 rounded"></div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6 text-center">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
          <p className="mb-3">{error}</p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  if (!loading && products.length === 0) {
    return (
      <div className="container py-6 sm:py-8 px-4 sm:px-6 text-center">
        <p className="text-lg">No products available</p>
        <Button variant="link" onClick={() => window.location.reload()} className="mt-2">
          Refresh
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 md:mb-10 text-center text-primary"
      >
        Our Products
      </motion.h1>
      
      {/* Search Bar */}
      <div className="mb-6 sm:mb-8 max-w-md mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products by name or category..."
            className="pl-10 focus:border-primary"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 font-bold -translate-y-1/2 text-muted-foreground"
            >
              ✕
            </button>
          )}
        </div>
        {searchQuery && (
          <p className="text-sm text-muted-foreground mt-4 text-center">
            {filteredProducts.length} products found
          </p>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg">No products match your search</p>
          <Button 
            variant="outline" 
            className="mt-4"
            onClick={() => setSearchQuery('')}
          >
            Clear search
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {paginatedProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.3) }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col group">
                  <Link href={`/products/${product.id}`} passHref>
                    <CardHeader className="flex-1 p-0">
                      <div className="relative aspect-square">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-cover rounded-t-lg"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          priority={index < 4}
                          loading={index >= 4 ? "lazy" : "eager"}
                        />
                      </div>
                    </CardHeader>
                  </Link>
                  <CardContent className="p-3 sm:p-4">
                    <Link href={`/products/${product.id}`}>
                      <CardTitle className="text-sm sm:text-base md:text-lg hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </CardTitle>
                    </Link>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-primary font-bold text-sm sm:text-base">
                        ₦{product.price.toLocaleString()}
                      </p>
                      <span className="text-xs text-muted-foreground capitalize">
                        {product.category}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex justify-center items-center gap-1 sm:gap-2 md:gap-4 mt-6 sm:mt-8"
              aria-label="Pagination"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="gap-1 text-xs sm:text-sm"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Previous</span>
              </Button>
              
              {/* Always show first page if not visible */}
              {!pageRange.includes(1) && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(1)}
                    className="text-xs sm:text-sm h-8 w-8 sm:h-9 sm:w-9 p-0 sm:p-2"
                  >
                    1
                  </Button>
                  {currentPage > Math.floor(VISIBLE_PAGES/2) + 1 && (
                    <span className="px-1">...</span>
                  )}
                </>
              )}

              {/* Page Numbers */}
              {pageRange.map(page => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => goToPage(page)}
                  className="text-xs sm:text-sm h-8 w-8 sm:h-9 sm:w-9 p-0 sm:p-2"
                  aria-current={currentPage === page ? "page" : undefined}
                >
                  {page}
                </Button>
              ))}

              {/* Always show last page if not visible */}
              {!pageRange.includes(totalPages) && (
                <>
                  {currentPage < totalPages - Math.floor(VISIBLE_PAGES/2) && (
                    <span className="px-1">...</span>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(totalPages)}
                    className="text-xs sm:text-sm h-8 w-8 sm:h-9 sm:w-9 p-0 sm:p-2"
                  >
                    {totalPages}
                  </Button>
                </>
              )}
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="gap-1 text-xs sm:text-sm"
                aria-label="Next page"
              >
                <span className="hidden sm:inline">Next</span>
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}