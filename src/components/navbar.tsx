"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, Sun, Moon, Menu, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useTheme } from 'next-themes'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCartStore } from '@/lib/store'
import { auth } from '@/lib/firebase'
import { onAuthStateChanged, signOut, User } from 'firebase/auth'
import { toast } from 'sonner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

interface NavRoute {
  href: string
  label: string
}

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const cartItems = useCartStore((state) => state.items)

  const NAV_ROUTES: NavRoute[] = [
    { href: '/', label: 'Home' },
    { href: '/products', label: 'Products' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ]

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user)
      setIsLoading(false)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error signing out. Please try again.')
    }
  }

  const getUserInitial = (email: string | null) => {
    return email ? email.charAt(0).toUpperCase() : 'U'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-16">
      <nav className="container flex h-full items-center justify-between px-4 sm:px-6">
        {/* Mobile Menu Button and Logo */}
        <div className="flex items-center gap-2 h-full">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            
            <SheetContent side="left" className="w-[280px] sm:w-[300px]">
              <div className="flex flex-col h-full">
                <SheetTitle className="mb-6">
                  <Link href="/" onClick={() => setIsOpen(false)}>
                    <span className="text-xl font-bold text-primary dark:text-primary-foreground">
                      MEHKOVA
                    </span>
                  </Link>
                </SheetTitle>
                
                <nav className="flex-1 flex flex-col gap-2">
                  {NAV_ROUTES.map((route) => (
                    <Link
                      key={route.href}
                      href={route.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        pathname === route.href 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:bg-accent'
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {route.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-auto pt-4 border-t">
                  {isLoading ? (
                    <div className="space-y-2 animate-pulse">
                      <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                    </div>
                  ) : currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 px-4 py-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={currentUser.photoURL || undefined} />
                          <AvatarFallback className="bg-primary text-white text-sm">
                            {getUserInitial(currentUser.email)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate">
                          {currentUser.email?.split('@')[0] || 'User'}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          handleLogout()
                          setIsOpen(false)
                        }}
                        className="w-full px-4 py-2 rounded-lg text-sm font-medium text-left text-muted-foreground hover:bg-accent flex items-center gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/auth/login"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-center text-primary border border-primary hover:bg-primary/10"
                        onClick={() => setIsOpen(false)}
                      >
                        Log in
                      </Link>
                      <Link
                        href="/auth/signup"
                        className="px-4 py-2 rounded-lg text-sm font-medium text-center bg-primary text-white hover:bg-primary/90"
                        onClick={() => setIsOpen(false)}
                      >
                        Sign up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center h-full">
            <span className="text-xl md:text-2xl font-bold text-primary uppercase dark:text-primary-foreground hover:text-primary/80 transition-colors">
              MEHKOVA
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6 mx-4">
          {NAV_ROUTES.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`text-sm font-medium transition-colors hover:text-primary relative ${
                pathname === route.href ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              {route.label}
              {pathname === route.href && (
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-primary rounded-full" />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 shadow-none"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-gray-400" />
          </Button>

          <Link href="/cart" aria-label="Shopping cart">
            <Button variant="ghost" size="icon" className="h-10 w-10 relative shadow-none dark:text-gray-400">
              <ShoppingCart className="h-7 w-7" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 h-4 w-4 rounded-full p-2 bg-primary text-[10px] text-white flex items-center justify-center ">
                  {cartItems.length}
                </span>
              )}
            </Button>
          </Link>

          {isLoading ? (
            <div className="hidden md:flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            </div>
          ) : currentUser ? (
            <div className="hidden md:flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.photoURL || undefined} />
                <AvatarFallback className="bg-primary text-white text-sm">
                  {getUserInitial(currentUser.email)}
                </AvatarFallback>
              </Avatar>
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-md gap-1 text-primary hover:bg-primary/10"
                onClick={handleLogout}
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only">Logout</span>
              </Button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="h-8 rounded-xl">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm" className="h-8 rounded-xl">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}