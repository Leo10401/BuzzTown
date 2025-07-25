"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Ticket,
  TrendingUp,
} from "lucide-react"

export default function EventCard({ eventData }) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [currentImgIdx, setCurrentImgIdx] = useState(0)

  let images = Array.isArray(eventData.image)
    ? eventData.image.filter((url) => typeof url === "string" && url.trim().length > 0)
    : []

  if (images.length === 0) images = ["/placeholder.svg?height=240&width=400"]

  const handleWishlist = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    console.log("Share event:", eventData._id)
  }

  const handlePrevImg = (e) => {
    e.stopPropagation()
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNextImg = (e) => {
    e.stopPropagation()
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const stringSlicer = (str, limit) => {
    if (str && str.length > limit) {
      return str.slice(0, limit) + "..."
    }
    return str || ""
  }

  const formatDate = (dateString) => {
    if (!dateString) return "TBA"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-gradient-to-r from-green-500 to-green-600"
      case "ongoing":
        return "bg-gradient-to-r from-blue-500 to-blue-600"
      case "completed":
        return "bg-gradient-to-r from-gray-500 to-gray-600"
      case "cancelled":
        return "bg-gradient-to-r from-red-500 to-red-600"
      default:
        return "bg-gradient-to-r from-green-500 to-green-600"
    }
  }

  const getMinPrice = () => {
    if (Array.isArray(eventData.tickets) && eventData.tickets.length > 0) {
      const prices = eventData.tickets.map((t) => Number(t.price)).filter((p) => !isNaN(p))
      if (prices.length === 0) return null
      return Math.min(...prices)
    }
    return null
  }

  const minPrice = getMinPrice()

  const cardVariants = {
    initial: {
      scale: 1,
      rotateY: 0,
      z: 0,
    },
    hover: {
      scale: 1.02,
      rotateY: 1,
      z: 50,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  }

  const imageVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 border-0 rounded-2xl w-full max-w-3xl mx-auto"
        onClick={() => router.push("/productdetails/" + eventData._id)}
      >
        {/* Image Section */}
        <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
          <motion.div variants={imageVariants} className="w-full h-full">
            <Image
              src={images[currentImgIdx] || "/placeholder.svg"}
              alt={eventData.title}
              fill
              className="object-cover"
            />
          </motion.div>

          {/* Image Navigation */}
          {images.length > 1 && (
            <AnimatePresence>
              {isHovered && (
                <>
                  <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors z-10"
                    onClick={handlePrevImg}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-colors z-10"
                    onClick={handleNextImg}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </>
              )}
            </AnimatePresence>
          )}

          {/* Image Indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <motion.div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentImgIdx ? "bg-white scale-125" : "bg-white/60"
                  }`}
                  whileHover={{ scale: 1.2 }}
                />
              ))}
            </div>
          )}

          {/* Badges Row: Trending and Status */}
          <div className="absolute top-4 left-4 flex flex-row items-center gap-2 z-10">
            {/* Trending Badge */}
            {Math.random() > 0.7 && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white border-0 shadow-lg">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Trending
                </Badge>
              </motion.div>
            )}
            {/* Status Badge */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Badge className={`${getStatusColor(eventData.status || "upcoming")} text-white border-0 shadow-lg`}>
                {eventData.status?.toUpperCase() || "UPCOMING"}
              </Badge>
            </motion.div>
          </div>
        </div>

        {/* Title and Action Buttons Row - IMPROVED */}
        <div className="flex items-start justify-between px-5 pt-3 pb-0 gap-3">
          {/* Title Container with proper flex and overflow handling */}
          <div className="flex-1 min-w-0 pr-2">
            <h3 className="font-bold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors duration-300 text-left overflow-hidden">
              {/* Multi-line title with proper ellipsis */}
              <span className="block line-clamp-2 break-words">{eventData.title}</span>
            </h3>
          </div>

          {/* Action Buttons - Always visible with fixed width */}
          <div className="flex flex-row gap-2 flex-shrink-0 ml-auto">
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
              onClick={handleWishlist}
            >
              <Heart className={`h-4 w-4 transition-colors ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="h-9 w-9 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border-0"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <CardContent className="p-5">
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Description - with better overflow handling */}
            {eventData.description && (
              <div className="overflow-hidden">
                <p className="text-gray-600 line-clamp-2 mt-0.5 text-sm leading-relaxed break-words">
                  {eventData.description}
                </p>
              </div>
            )}

            {/* Event Details */}
            <div className="grid grid-cols-2 gap-2">
              {eventData.location && (
                <motion.div
                  className="flex items-center gap-2 text-gray-600 min-w-0"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-3.5 w-3.5 text-blue-600" />
                  </div>
                  <span className="text-xs font-medium truncate" title={eventData.location}>
                    {eventData.location}
                  </span>
                </motion.div>
              )}
              {eventData.startTime && (
                <motion.div
                  className="flex items-center gap-2 text-gray-600 min-w-0"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="h-3.5 w-3.5 text-green-600" />
                  </div>
                  <span className="text-xs font-medium truncate">{eventData.startTime}</span>
                </motion.div>
              )}
              {eventData.capacity && (
                <motion.div
                  className="flex items-center gap-2 text-gray-600 col-span-2 min-w-0"
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-7 h-7 bg-purple-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Users className="h-3.5 w-3.5 text-purple-600" />
                  </div>
                  <span className="text-xs font-medium truncate">
                    {eventData.attendees || 0}/{eventData.capacity} attending
                  </span>
                </motion.div>
              )}
            </div>

            {/* Category */}
            {eventData.category && (
              <div className="flex items-center">
                <Badge variant="outline" className="text-xs font-medium bg-gray-50 border-gray-200 truncate max-w-full">
                  {eventData.category}
                </Badge>
              </div>
            )}

            {/* Date and Price at Bottom */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100 gap-4">
              {/* Date */}
              {eventData.date && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex items-center gap-2 min-w-0 flex-1"
                >
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-gray-500">Event Date</p>
                    <p className="text-sm font-semibold text-gray-800 truncate">{formatDate(eventData.date)}</p>
                  </div>
                </motion.div>
              )}

              {/* Price */}
              {minPrice && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-2 flex-shrink-0"
                >
                  <div className="text-right">
                    <p className="text-xs text-gray-500 whitespace-nowrap">Starting from</p>
                    <div className="flex items-center gap-1">
                      <Ticket className="h-4 w-4 text-green-600" />
                      <span className="text-lg font-bold text-green-600 whitespace-nowrap">
                        ₹{minPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
