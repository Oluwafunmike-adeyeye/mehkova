"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FeaturedProducts } from '@/components/featuredProducts'
import { Crown, Star, Truck } from "lucide-react"
import Link from "next/link"

// Animation variants for reusability
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const featureCards = [
  {
    icon: Crown,
    title: "Premium Quality",
    description: "Handpicked fashion and jewelry pieces of the highest quality",
    delay: 0
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Quick and secure delivery across Nigeria",
    delay: 0.2
  },
  {
    icon: Star,
    title: "Best Prices",
    description: "Competitive prices with regular discounts",
    delay: 0.4
  }
];

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)]">
      {/* Hero Section */}
      <section 
        className="relative min-h-[60vh] flex items-center justify-center bg-gradient-to-r from-purple-900 via-purple-800 to-purple-900 text-white px-4"
        aria-labelledby="main-heading"
      >
        <div className="absolute inset-0 bg-noise opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container text-center px-4 sm:px-6 z-10"
        >
          <h1 id="main-heading" className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-6">
            Elevate Your Style
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto">
            Discover exquisite jewelry and fashion pieces that reflect your unique personality
          </p>
          <Link href="/products" passHref legacyBehavior>
            <Button 
              size="lg" 
              className="bg-white text-purple-900 hover:bg-purple-100 text-sm sm:text-base"
              aria-label="Browse our product collection"
            >
              Shop Now
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8" aria-labelledby="features-heading">
        <div className="container">
          <h2 id="features-heading" className="sr-only">Our Advantages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {featureCards.map((card, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                variants={cardVariants}
                transition={{ duration: 0.5, delay: card.delay }}
                viewport={{ once: true, margin: "0px 0px -50px 0px" }}
              >
                <Card className="p-4 sm:p-6 text-center hover:shadow-lg transition-shadow transform hover:scale-105 h-full">
                  <card.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-primary" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {card.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section aria-labelledby="featured-products-heading" className="pb-16">
        <FeaturedProducts />
      </section>
    </div>
  )
}
