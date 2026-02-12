"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function SignUpPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    practiceName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError("")
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validation
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.practiceName) {
      setError("Please fill in all fields")
      setIsLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters")
      setIsLoading(false)
      return
    }

    try {
      // Call real signup API (Supabase)
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          practiceName: formData.practiceName,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Sign up failed")
        return
      }

      // Store user session and redirect
      if (data.success && data.user) {
        // Store session info in localStorage for demo
        localStorage.setItem('orasync_user', JSON.stringify(data.user))
        router.push("/dashboard")
      } else {
        setError("Sign up failed")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSignUp = (provider: string) => {
    setIsLoading(true)
    // Direct redirect to Supabase OAuth
    window.location.href = `/api/auth/${provider}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-background to-purple-50 dark:from-slate-950 dark:via-background dark:to-blue-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 dark:bg-blue-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200 dark:bg-purple-900/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-top duration-700">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">O</span>
            </div>
            <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Orasync</span>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-3">Join Orasync</h1>
          <p className="text-muted-foreground text-lg">Start with 50 free credits for your dental practice</p>
        </div>

        <Card className="p-8 border border-gray-200 dark:border-slate-700/50 bg-white dark:bg-slate-800/50 backdrop-blur-xl shadow-2xl rounded-2xl animate-in fade-in slide-in-from-bottom duration-700 delay-100">
          {error && (
            <Alert variant="destructive" className="mb-6 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="practiceName" className="text-foreground font-semibold text-sm">
                Practice Name
              </Label>
              <Input
                id="practiceName"
                name="practiceName"
                placeholder="Your Dental Practice"
                value={formData.practiceName}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-semibold text-sm">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-semibold text-sm">
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-xs text-muted-foreground mt-1">Minimum 8 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-semibold text-sm">
                Confirm Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="mt-1 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-8 h-11 rounded-lg font-bold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-95" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-slate-700/30"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-slate-800/50 px-3 text-muted-foreground font-medium">Or continue with</span>
            </div>
          </div>

          {/* OAuth Buttons */}
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
              onClick={() => handleOAuthSignUp("google")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
              onClick={() => handleOAuthSignUp("facebook")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </Button>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-700/30 hover:bg-gray-50 dark:hover:bg-slate-700 transition-all"
              onClick={() => handleOAuthSignUp("apple")}
              disabled={isLoading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.53 3.2l-.42-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
            </Button>
          </div>

          {/* Sign In Link */}
          <p className="text-center text-sm text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-primary hover:text-primary/80 font-semibold transition-colors">
              Sign in
            </Link>
          </p>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground mt-6">
          By signing up, you agree to our{" "}
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  )
}
