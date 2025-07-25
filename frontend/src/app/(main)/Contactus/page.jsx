"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ContactInfo } from "@/components/contact-info"
import { Twitter, Youtube, Instagram, Send, Mail, MessageSquare, User, CheckCircle } from "lucide-react"
import { toast } from "react-hot-toast"

export default function ContactUs() {
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const socialLinks = [
    { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
    { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-500" },
    { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-500" },
  ]

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.email || !formData.message) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast.success("Message sent successfully! We'll get back to you within 24 hours.")
      setFormData({ email: "", name: "", message: "" })
    } catch (error) {
      toast.error("Failed to send message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Get in Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Have a question or want to work together? We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-2xl">
                  <MessageSquare className="h-6 w-6 text-blue-600" />
                  <span>Let's Connect</span>
                </CardTitle>
                <CardDescription className="text-base">
                  Leave your email and we will get back to you within 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContactInfo />
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">Follow Us</CardTitle>
                <CardDescription>Stay connected on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={index}
                        href={social.href}
                        aria-label={social.label}
                        className={`p-3 rounded-full bg-gray-100 transition-all duration-300 hover:bg-gray-200 hover:scale-110 ${social.color}`}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Quick Response Promise */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-2">
                <CheckCircle className="h-6 w-6" />
                <h3 className="text-lg font-semibold">Quick Response Guarantee</h3>
              </div>
              <p className="text-blue-100">
                We typically respond to all inquiries within 2-4 hours during business hours.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-0 shadow-xl bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-2xl">
                <Mail className="h-6 w-6 text-blue-600" />
                <span>Send us a Message</span>
              </CardTitle>
              <CardDescription className="text-base">
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center space-x-1">
                      <Mail className="h-4 w-4" />
                      <span>Email *</span>
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>Name</span>
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium flex items-center space-x-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>Your Message *</span>
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us about your project, question, or how we can help you..."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    required
                    rows={6}
                    className="border-2 border-gray-200 focus:border-blue-500 transition-colors resize-none"
                  />
                </div>

                <Separator />

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold transition-all duration-300 hover:scale-105"
                >
                  {isSubmitting ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Sending...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Prefer to talk directly?</h3>
            <p className="text-gray-600 mb-6">Schedule a call with our team to discuss your needs in detail.</p>
            <Button variant="outline" size="lg" className="border-2 hover:bg-blue-50 bg-transparent">
              Schedule a Call
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
