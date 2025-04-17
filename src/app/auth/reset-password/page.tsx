"use client"
import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { verifyPasswordResetCode, confirmPasswordReset, AuthError } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Suspense } from 'react'

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordComponent />
    </Suspense>
  )
}

function ResetPasswordComponent() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [oobCode, setOobCode] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('oobCode')
    if (code) {
      verifyPasswordResetCode(auth, code)
        .then(() => {
          setOobCode(code)
        })
        .catch((error: AuthError) => {
          toast.error(error.message || 'Invalid or expired reset link')
        })
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      await confirmPasswordReset(auth, oobCode, newPassword)
      toast.success('Password reset successfully! You can now login.')
      window.location.href = '/auth/login'
    } catch (error) {
      const authError = error as AuthError
      toast.error(authError.message || 'Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 rounded-3xl">
        <h2 className="text-xl font-bold mb-6 text-center text-primary">Reset Password</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">New Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                placeholder='*********'
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={6}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 shadow-none hover:shadow-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                placeholder='*********'
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 shadow-none"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full mt-6">
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Card>
    </div>
  )
}