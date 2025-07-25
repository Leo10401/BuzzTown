"use client"

import React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "react-hot-toast"
import useAppContext from "@/context/AppContext";

export function Login({ onSwitchToSignup }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    keepLoggedIn: false,
  })
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { login } = useAppContext();

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/^\S+@\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        toast.success("Logged in successfully")

        // Store user data using context login
        if (typeof window !== "undefined") {
          login({
            ...data,
            email: formData.email, // ensure email is present
            keepLoggedIn: formData.keepLoggedIn,
          });
        }

        // Redirect based on role
        if (data.role === "admin") {
          router.push("/admin/manageproduct")
        } else {
          router.push("/")
        }
      } else {
        toast.error("Invalid credentials. Please try again.")
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="hello@example.com"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Your password"
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={errors.password ? "border-red-500" : ""}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="keepLoggedIn"
          checked={formData.keepLoggedIn}
          onCheckedChange={(checked) => handleInputChange("keepLoggedIn", !!checked)}
        />
        <Label htmlFor="keepLoggedIn" className="text-sm">
          Keep me logged in
        </Label>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>

      <div className="text-center space-y-2">
        <button type="button" onClick={onSwitchToSignup} className="text-sm text-blue-600 hover:underline">
          {"Don't have an account? Sign up"}
        </button>
        <div>
          <Link href="/reset-password" className="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </Link>
        </div>
      </div>
    </form>
  )
}
