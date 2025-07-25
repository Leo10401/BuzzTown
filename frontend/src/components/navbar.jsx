"use client"
import Link from "next/link"
import Image from "next/image"
import { Menu, ChevronDown, User, LogOut, Ticket } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useEffect, useState } from "react"
import useAppContext from "@/context/AppContext"
import useCartContext from "@/context/CartContext"

export function Navbar() {
  const { loggedIn, currentUser, logout } = useAppContext()
  const { cartItems } = useCartContext()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Hide on scroll logic
  const [show, setShow] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (typeof window === "undefined") return
      const currentScrollY = window.scrollY
      if (currentScrollY < 10) {
        setShow(true)
      } else if (currentScrollY > lastScrollY) {
        setShow(false)
      } else {
        setShow(true)
      }
      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  const UserMenu = () => {
    if (!mounted) return null // Prevent hydration mismatch

    if (loggedIn && currentUser) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300 rounded-lg px-3 py-2 group"
            >
              <Avatar className="h-6 w-6 ring-2 ring-transparent group-hover:ring-cyan-400 transition-all duration-300">
                <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name || "User"} />
                <AvatarFallback className="bg-cyan-500 text-white">
                  {currentUser.name ? currentUser.name.charAt(0) : "U"}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">{currentUser.name || currentUser.email}</span>
              <ChevronDown className="h-4 w-4 transition-transform duration-300 group-hover:rotate-180" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 bg-black/90 backdrop-blur-md border border-white/20 text-white shadow-2xl"
          >
            <DropdownMenuItem
              asChild
              className="hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors duration-200"
            >
              <Link href="/user/profile" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              asChild
              className="hover:bg-cyan-500/20 hover:text-cyan-300 transition-colors duration-200"
            >
              <Link href="/user/mytickets" className="flex items-center">
                <Ticket className="mr-2 h-4 w-4" />
                My Tickets
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/20" />
            <DropdownMenuItem
              onClick={logout}
              className="text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-200"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }

    return (
      <Button
        asChild
        className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium px-6 py-2 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25"
      >
        <Link href="/authenticate">Log in</Link>
      </Button>
    )
  } // end UserMenu

  return (
    <div
      className="fixed top-0 left-0 w-full z-50 transition-transform duration-300"
      style={{ willChange: "transform" }}
    >
      <header
        className={`flex items-center w-full justify-between py-4 px-6 md:px-20 bg-black/40 backdrop-blur-xl border-b border-white/10 transition-all duration-300 ${
          show ? "translate-y-0" : "-translate-y-full"
        } text-white`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center group transition-transform duration-300 hover:scale-105">
          <div className="relative overflow-hidden rounded-lg">
            <Image
              src="/logobuzz.png"
              alt="Buzztown"
              width={60}
              height={40}
              className="transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2">
          {[
            { href: "/", label: "Home" },
            { href: "/browse", label: "Upcoming Events" },
            { href: "/previousevents", label: "Previous Events" },
            { href: "/footer/about", label: "About Us" },
            { href: "/Contactus", label: "Contact" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="relative text-sm font-medium text-white px-4 py-2 rounded-lg transition-all duration-300 group overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">{item.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg" />
              <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-lg delay-75" />
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-4 text-white">
          {loggedIn && (
            <Link
              href="/user/cartpage"
              className="relative flex items-center group p-2 rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              <div className="relative">
                <Ticket className="h-6 w-6 transition-all duration-300 group-hover:text-cyan-300 group-hover:scale-110" />
                {cartItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse shadow-lg">
                    {cartItems.length}
                  </span>
                )}
              </div>
              <span className="sr-only">Tickets</span>
            </Link>
          )}
          <UserMenu />
        </div>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden text-white hover:bg-white/10 hover:text-cyan-300 transition-all duration-300 p-2 rounded-lg group"
            >
              <Menu className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full bg-black/95 backdrop-blur-xl text-white border-l border-white/20"
          >
            <div className="flex flex-col space-y-4 mt-6">
              {[
                { href: "/", label: "Home" },
                { href: "/browse", label: "Upcoming Events" },
                { href: "/previousevents", label: "Previous Events" },
                { href: "/footer/about", label: "About Us" },
                { href: "/Contactus", label: "Contact" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-sm font-medium py-3 px-4 text-white rounded-lg transition-all duration-300 group overflow-hidden"
                >
                  <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                    {item.label}
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-500 transform translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-lg" />
                </Link>
              ))}

              <Separator className="my-4 bg-white/20" />

              <div className="flex flex-col space-y-2">
                {loggedIn ? (
                  <div className="space-y-2">
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start w-full text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-300 rounded-lg group"
                    >
                      <Link href="/user/profile">
                        <User className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        Profile
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start w-full text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-300 rounded-lg group"
                    >
                      <Link href="/user/my-tickets">
                        <Ticket className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        My Tickets
                      </Link>
                    </Button>
                    {/* Cart/Tickets for mobile */}
                    <Button
                      asChild
                      variant="ghost"
                      className="justify-start w-full text-white hover:bg-gradient-to-r hover:from-cyan-500 hover:to-blue-500 hover:text-white transition-all duration-300 rounded-lg group relative"
                    >
                      <Link href="/user/cartpage">
                        <Ticket className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                        Tickets
                        {cartItems.length > 0 && (
                          <span className="absolute top-1 right-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 font-bold animate-pulse">
                            {cartItems.length}
                          </span>
                        )}
                      </Link>
                    </Button>
                    <Button
                      onClick={logout}
                      variant="ghost"
                      className="justify-start w-full text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-300 rounded-lg group"
                    >
                      <LogOut className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                      Logout
                    </Button>
                  </div>
                ) : (
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/25 rounded-lg"
                  >
                    <Link href="/authenticate">Log in</Link>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </header>
    </div>
  )
}
