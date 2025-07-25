"use client"

import Link from "next/link"
import Image from "next/image"
import { Twitter, Youtube, Instagram, Facebook, Mail, Phone, MapPin, Calendar, Music, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const footerLinks = [
  {
    title: "Events",
    links: [
      { label: "Upcoming Events", href: "/browse" },
      { label: "Previous Events", href: "/previousevents" },
      { label: "Event Calendar", href: "/calendar" },
      { label: "Featured Artists", href: "/artists" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Contact Us", href: "/Contactus" },
      { label: "Ticket Support", href: "/ticket-support" },
      { label: "Refund Policy", href: "/refund-policy" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/footer/about" },
      { label: "Careers", href: "/careers" },
      { label: "Press", href: "/press" },
      { label: "Partner with Us", href: "/partners" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
      { label: "Accessibility", href: "/accessibility" },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, href: "#", label: "Facebook", color: "hover:text-blue-600" },
  { icon: Instagram, href: "#", label: "Instagram", color: "hover:text-pink-600" },
  { icon: Twitter, href: "#", label: "Twitter", color: "hover:text-blue-400" },
  { icon: Youtube, href: "#", label: "YouTube", color: "hover:text-red-600" },
]

const stats = [
  { icon: Calendar, value: "500+", label: "Events Hosted" },
  { icon: Users, value: "50K+", label: "Happy Attendees" },
  { icon: Music, value: "100+", label: "Artists Featured" },
]

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-4">
            <div className="flex items-center mb-6">
              <Image src="/logobuzz.png" alt="Buzztown" width={180} height={50} className="brightness-0 invert" />
            </div>
            <p className="text-gray-300 mb-6 text-lg font-medium">Move With The Buzztown Live</p>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Experience unforgettable live events, concerts, and entertainment. Join thousands of music lovers and
              create memories that last a lifetime.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-300">
                <Mail className="h-4 w-4 text-primary" />
                <span className="text-sm">hello@buzztown.live</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <Phone className="h-4 w-4 text-primary" />
                <span className="text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-3 text-gray-300">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm">Mumbai, Maharashtra, India</span>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.label}
                  variant="ghost"
                  size="icon"
                  asChild
                  className={`bg-gray-800 hover:bg-gray-700 ${social.color} transition-colors`}
                >
                  <Link href={social.href} aria-label={social.label}>
                    <social.icon className="h-4 w-4" />
                  </Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {footerLinks.map((group) => (
                <div key={group.title}>
                  <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">{group.title}</h3>
                  <ul className="space-y-3">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="text-gray-400 hover:text-white transition-colors text-sm hover:underline"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col md:flex-row items-center gap-4 text-sm text-gray-400">
              <p>© 2024 Buzztown Ltd. All rights reserved.</p>
              <div className="flex items-center gap-4">
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy
                </Link>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-500">♥</span>
              <span>for music lovers</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
