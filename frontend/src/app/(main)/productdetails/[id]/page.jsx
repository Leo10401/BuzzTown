"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Star,
  MapPin,
  Calendar,
  Clock,
  Tag,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react"
import { toast } from "react-hot-toast"
import ReactTimeAgo from "react-time-ago"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import useCartContext from "@/context/CartContext"
import Link from "next/link"

const EventPage = () => {
  const { id } = useParams()
  const [selTicket, setSelTicket] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [productDetails, setProductDetails] = useState(null)
  const { cartItems, addItem, checkItemExists, cartOpened, toggleCart } = useCartContext()
  const [reviewList, setReviewList] = useState([])
  const [rating, setRating] = useState(5)
  const reviewRef = useRef()
  const [currentImgIdx, setCurrentImgIdx] = useState(0)
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(typeof window !== "undefined" ? sessionStorage.getItem("user") : null),
  )
  const [isLoading, setIsLoading] = useState(true)

  const fetchReviews = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/getbyproduct/${id}`)
      const data = await response.json()
      setReviewList(data)
    } catch (error) {
      console.error("Error fetching reviews:", error)
    }
  }

  const calculateAverageRating = () => {
    if (reviewList.length === 0) return 0
    let total = 0
    reviewList.forEach((review) => {
      total += review.rating
    })
    return (total / reviewList.length).toFixed(1)
  }

  const getProductDetails = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/product/getbyid/${id}`)
      const data = await response.json()
      setProductDetails(data)
      if (data.tickets && data.tickets.length > 0) {
        setSelTicket(data.tickets[0])
      }
    } catch (error) {
      console.error("Error fetching product details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
    getProductDetails()
  }, [])

  const StarRating = ({ value, onChange, readOnly = false, size = "default" }) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      default: "w-5 h-5",
      lg: "w-6 h-6",
    }

    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${sizeClasses[size]} cursor-pointer transition-colors ${
              star <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
            onClick={() => !readOnly && onChange && onChange(star)}
          />
        ))}
        {readOnly && <span className="ml-2 text-sm text-gray-600">({value})</span>}
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!selTicket) {
      toast.error("Please select a ticket type")
      return
    }

    const cartItem = {
      ...productDetails,
      selectedTicket: selTicket,
      quantity: quantity,
      totalPrice: selTicket.price * quantity,
    }

    addItem(cartItem)
    toast.success("Added to cart successfully")
  }

  const displayProductDetails = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )
    }

    if (!productDetails) return null

    let images = Array.isArray(productDetails.image)
      ? productDetails.image.filter((url) => typeof url === "string" && url.trim().length > 0)
      : []
    if (images.length === 0) images = ["/placeholder.svg?height=400&width=600"]

    return (
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={images[currentImgIdx] || "/placeholder.svg"}
              alt={productDetails.title}
              className="w-full h-96 rounded-lg object-cover"
            />
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setCurrentImgIdx(currentImgIdx === 0 ? images.length - 1 : currentImgIdx - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setCurrentImgIdx((currentImgIdx + 1) % images.length)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === currentImgIdx ? "bg-white" : "bg-white/50"
                      }`}
                      onClick={() => setCurrentImgIdx(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-colors ${
                    idx === currentImgIdx ? "border-blue-500" : "border-gray-200"
                  }`}
                  onClick={() => setCurrentImgIdx(idx)}
                >
                  <img
                    src={img || "/placeholder.svg"}
                    alt={`${productDetails.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details Section */}
        <div className="space-y-6">
          <div className="flex items-start justify-between">
            <Button variant="ghost" size="sm" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{productDetails.title}</h1>
            <div className="flex items-center gap-4 mb-4">
              <StarRating value={calculateAverageRating()} readOnly />
              <span className="text-sm text-gray-500">({reviewList.length} reviews)</span>
            </div>
            <p className="text-gray-600 leading-relaxed">{productDetails.description}</p>
          </div>

          <Separator />

          {/* Event Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Location:</span>
              <span className="text-gray-600 capitalize">{productDetails.location}</span>
            </div>
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Date:</span>
              <span className="text-gray-600">{new Date(productDetails.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Start Time:</span>
              <span className="text-gray-600">{productDetails.startTime}</span>
            </div>
            <div className="flex items-center gap-3">
              <Tag className="w-5 h-5 text-gray-500" />
              <span className="font-medium">Category:</span>
              <Badge variant="secondary">{productDetails.category}</Badge>
            </div>
          </div>

          <Separator />

          {/* Ticket Selection */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Select Tickets</h3>
            <div className="space-y-3">
              {productDetails.tickets.map((ticket, index) => (
                <Card
                  key={index}
                  className={`cursor-pointer transition-colors ${
                    selTicket === ticket ? "ring-2 ring-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => setSelTicket(ticket)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-medium">{ticket.type}</h4>
                        <p className="text-sm text-gray-500">Available: {ticket.availability}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold">₹{ticket.price}</p>
                        {ticket.availability === 0 && <Badge variant="destructive">Sold Out</Badge>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selTicket && selTicket.availability > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="font-medium">Quantity:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setQuantity(Math.min(selTicket.availability, quantity + 1))}
                      disabled={quantity >= selTicket.availability}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">₹{(selTicket.price * quantity).toLocaleString()}</span>
                </div>

                <Button className="w-full" size="lg" onClick={handleAddToCart}>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  const submitReview = async () => {
    if (!currentUser) {
      toast.error("Please login to leave a review")
      return
    }

    const review = reviewRef.current.value
    if (!review.trim()) {
      toast.error("Please write a review")
      return
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": currentUser.token,
        },
        body: JSON.stringify({
          product: id,
          review,
          rating,
        }),
      })

      if (response.status === 200) {
        fetchReviews()
        reviewRef.current.value = ""
        setRating(5)
        toast.success("Review submitted successfully")
      }
    } catch (error) {
      toast.error("Error submitting review")
    }
  }

  const deleteReview = async (reviewId) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review/delete/${reviewId}`, {
        method: "DELETE",
      })

      if (response.status === 200) {
        fetchReviews()
        toast.success("Review deleted successfully")
      }
    } catch (error) {
      toast.error("Error deleting review")
    }
  }

  const displayReviews = () => {
    if (reviewList.length === 0) {
      return (
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500">No reviews yet. Be the first to review this event!</p>
          </CardContent>
        </Card>
      )
    }

    return reviewList.map((review) => (
      <Card key={review._id}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={`${process.env.NEXT_PUBLIC_API_URL}/${review.user.avatar}`} alt={review.user.name} />
                <AvatarFallback>{review.user.name.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <h4 className="font-medium">{review.user.name}</h4>
                <p className="text-sm text-gray-500">
                  <ReactTimeAgo date={new Date(review.createdAt)} locale="en-US" />
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} readOnly size="sm" />
              {currentUser && currentUser._id === review.user._id && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteReview(review._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">{review.review}</p>
        </CardContent>
      </Card>
    ))
  }

  const ratingForm = () => {
    if (!currentUser) {
      return (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500 mb-4">Please login to leave a review</p>
            <Link href="/login">
              <Button>Login to Review</Button>
            </Link>
          </CardContent>
        </Card>
      )
    }

    return (
      <Card>
        <CardHeader>
          <CardTitle>Write a Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Rating</label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Your Review</label>
            <Textarea
              ref={reviewRef}
              placeholder="Share your experience with this event..."
              className="min-h-[100px]"
            />
          </div>
          <Button onClick={submitReview} className="w-full">
            Submit Review
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">{displayProductDetails()}</div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
            {reviewList.length > 0 && (
              <div className="flex items-center gap-2">
                <StarRating value={calculateAverageRating()} readOnly />
                <span className="text-sm text-gray-500">
                  {calculateAverageRating()} out of 5 ({reviewList.length} reviews)
                </span>
              </div>
            )}
          </div>

          {ratingForm()}

          <div className="space-y-4">{displayReviews()}</div>
        </div>
      </div>
    </div>
  )
}

export default EventPage
