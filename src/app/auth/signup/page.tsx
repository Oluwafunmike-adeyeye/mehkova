"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      toast.success('Account created successfully')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm sm:max-w-md"
      >
        <Card className="p-4 sm:p-6 rounded-3xl">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-2 sm:mb-3">Create Account</h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Sign up for a new account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                placeholder='johndoe@gmail.com'
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 text-sm sm:text-base"
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder='*********'
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 text-sm sm:text-base"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-9 h-7 w-7 sm:h-8 sm:w-8 shadow-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>

            <div className="relative">
              <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder='*********'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="mt-1 text-sm sm:text-base"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-10 h-7 w-7 sm:h-6 sm:w-6 shadow-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs sm:text-sm">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-primary underline hover:text-primary/80">
              Sign in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}