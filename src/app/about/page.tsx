"use client"

import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Crown, Heart, Shield, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'  
export default function AboutPage() {
  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">

      {/* Hero */}
      <section className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-primary">About Mehkova</h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Your premier destination for exquisite fashion and jewelry in Nigeria.
          </p>
        </motion.div>
      </section>

      {/* Features */}
      <section className="mb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {[{ icon: Crown, title: 'Premium Quality', description: 'We use the finest materials and skilled artisans to create pieces that last.' },
            { icon: Heart, title: 'Customer First', description: 'Your satisfaction is our priority — we’re here for you at every step.' },
            { icon: Shield, title: 'Secure Shopping', description: 'Your data is safe. Shop with confidence knowing your privacy is protected.' }].map((feature, index) => (
            <motion.div key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Card className="p-4 sm:p-6 text-center h-full">
                <feature.icon className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 text-primary" aria-hidden="true" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="max-w-3xl mx-auto text-center mb-20">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Our Story</h2>
          <p className="text-base sm:text-lg text-muted-foreground">
            Founded in 2024, Mehkova started as a small local boutique with a bold vision — to make high-quality fashion and jewelry accessible to everyone in Nigeria.
            <br /><br />
            We blend traditional craftsmanship with modern design. Every item in our collection is chosen with care to meet high standards of style and durability.
            <br /><br />
            At Mehkova, we believe that fashion and jewelry are personal. We offer something for every style and occasion.
            <br /><br />
            From outstanding support to secure checkout and fast delivery, we focus on delivering an experience — not just a product.
          </p>
        </motion.div>
      </section>

      {/* Testimonials */}
      <section className="mb-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-10">What Our Customers Say</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[{ name: 'Aisha B.', quote: 'The necklace I bought from Mehkova is stunning. Great quality and fast delivery!' },
            { name: 'Emeka O.', quote: 'Customer service is top-notch. They helped me pick the perfect gift for my wife.' },
            { name: 'Lola K.', quote: 'I love their unique designs. Always get compliments when I wear Mehkova pieces.' }].map((testimonial, idx) => (
            <Card key={idx} className="p-6 text-sm sm:text-base text-center">
              <Quote className="w-6 h-6 text-primary mx-auto mb-4" aria-hidden="true" />
              <p className="italic text-muted-foreground mb-3">"{testimonial.quote}"</p>
              <p className="font-semibold text-primary">{testimonial.name}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Meet the Founder */}
      <section className="mb-20 max-w-3xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-6">Meet the Founder</h2>
        <Image
          src="https://i.pinimg.com/474x/f4/90/12/f49012a2e79bc927a18361b16968b5c0.jpg" 
          alt="Founder of Mehkova"
          width={200}
          height={200}
          className="rounded-full mx-auto mb-4"
        />
        <p className="text-base sm:text-lg text-muted-foreground">
          Hello, I am Mehkova's founder. I started this brand to empower people through elegant, accessible fashion.
          Every design reflects a passion for beauty, culture, and confidence. Thank you for being part of the journey.
        </p>
      </section>

      {/* CTA */}
      <section className="text-center mb-10">
        <h2 className="text-xl sm:text-2xl font-semibold text-primary mb-4">Ready to explore our collections?</h2>
        <Link href="/products"> 
          <Button size="lg" className="text-sm sm:text-base">
            Shop Now
          </Button>
        </Link>
      </section>
    </div>
  )
}
