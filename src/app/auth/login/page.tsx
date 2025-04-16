"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth'
import { toast } from 'sonner'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      toast.success('Successfully logged in')
      
      // Redirect to the stored redirect URL or home page
      const redirectTo = searchParams.get('redirect') || '/'
      router.push(redirectTo)
    } catch (error) {
      if (error instanceof Error) {
        const authError = error as AuthError
        toast.error(getUserFriendlyError(authError.code))
      } else {
        toast.error('An unknown error occurred')
      }
    } finally {
      setIsSubmitting(false)
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
            <h2 className="text-2xl sm:text-3xl font-bold text-primary mb-3 sm:mb-4">
              Welcome Back
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <div>
              <Label htmlFor="email" className="text-sm sm:text-base">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="mt-1 text-sm sm:text-base py-1 px-4"
              />
            </div>

            <div className="relative">
              <Label htmlFor="password" className="text-sm sm:text-base">
                Password
              </Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="**********"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 text-sm sm:text-base py-1 px-4"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-10 h-8 w-8 sm:h-6 sm:w-6 shadow-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 sm:h-6 sm:w-6" />
                ) : (
                  <Eye className="h-5 w-5 sm:h-6 sm:w-6" />
                )}
              </Button>
            </div>

            <div className="flex justify-end">
              <Link
                href="/auth/forgot-password"
                className="text-xs sm:text-sm text-muted-foreground hover:text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full mt-4 sm:mt-6 text-sm sm:text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-4 text-center text-xs sm:text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href={`/auth/signup?redirect=${searchParams.get('redirect') || ''}`}
              className="text-primary underline hover:text-primary/80"
            >
              Sign up
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// Helper function to convert Firebase error codes to user-friendly messages
function getUserFriendlyError(errorCode: string): string {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    case 'auth/user-disabled':
      return 'This account has been disabled'
    case 'auth/user-not-found':
      return 'No account found with this email'
    case 'auth/wrong-password':
      return 'Incorrect password'
    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later'
    default:
      return 'Login failed. Please try again'
  }
}