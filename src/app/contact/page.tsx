"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, MapPin, Phone, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ContactFormData = {
  name: string
  email: string
  message: string
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
  })

  const [loading, setLoading] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulated API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast.success('Message sent successfully!')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4 text-primary">Contact Us</h1>
        <p className="text-lg sm:text-xl text-muted-foreground">
          We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Get in Touch</h2>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6" role="form">
              <div>
                <Label htmlFor="name" className="text-sm sm:text-base">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  className="mt-1 text-sm sm:text-base"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm sm:text-base">Message</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-required="true"
                  className="min-h-[120px] sm:min-h-[150px] mt-1 text-sm sm:text-base"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full text-sm sm:text-base" 
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </span>
                ) : (
                  'Send Message'
                )}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-4 sm:space-y-6"
        >
          <Card className="p-4 sm:p-6">
            <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <span aria-hidden="true">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 flex-shrink-0" />
              </span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Address</h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  123 Fashion Street, Lagos, Nigeria
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4 mb-3 sm:mb-4">
              <span aria-hidden="true">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 flex-shrink-0" />
              </span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Phone</h3>
                <p className="text-muted-foreground text-sm sm:text-base">+234 123 456 7890</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 sm:space-x-4">
              <span aria-hidden="true">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-0.5 flex-shrink-0" />
              </span>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Email</h3>
                <p className="text-muted-foreground text-sm sm:text-base">contact@mehkova.com</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Monday - Friday</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}