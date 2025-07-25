"use client"

import React from "react"

import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Heart, Eye } from "lucide-react"
import { useState } from "react"
import PropTypes from "prop-types"
import useCartContext from "@/context/CartContext"

const stringSlicer = (str, limit) => {
  if (str && str.length > limit) {
    return str.slice(0, limit) + "..."
  }
  return str || ""
}

function ProductCard({ productData }) {
  const { addItem, checkItemExists } = useCartContext()
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addItem(productData)
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    setIsWishlisted(!isWishlisted)
  }

  const handleQuickView = (e) => {
    e.stopPropagation()
    // Implement quick view functionality
    console.log("Quick view:", productData._id)
  }

  const discountedPrice = productData.offer
    ? productData.price - (productData.price * productData.offer) / 100
    : productData.price

  const isInCart = checkItemExists(productData._id)

  return (
    <Card
      className="group cursor-pointer overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => router.push("/productdetails/" + productData._id)}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/${productData.image}` || "/placeholder.svg?height=300&width=300"}
          alt={productData.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Discount Badge */}
        {productData.offer && (
          <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600">-{productData.offer}% OFF</Badge>
        )}

        {/* Action Buttons - Show on Hover */}
        <div
          className={`absolute top-2 right-2 flex flex-col gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleWishlist}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-8 w-8 bg-white/90 hover:bg-white"
            onClick={handleQuickView}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>

        {/* Add to Cart Button - Show on Hover */}
        <div
          className={`absolute bottom-2 left-2 right-2 transition-all duration-300 ${
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isInCart ? "In Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {/* Content Section */}
      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {productData.title}
          </h3>
          <p className="text-gray-600 text-sm line-clamp-2">
            {stringSlicer(productData.description, 80)}
          </p>
          {productData.category && (
            <Badge variant="outline" className="text-xs">
              {productData.category}
            </Badge>
          )}
        </div>
      </CardContent>

      {/* Footer Section */}
      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">₹{typeof discountedPrice === 'number' ? discountedPrice.toLocaleString() : 'N/A'}</span>
              {productData.offer && (
                <span className="text-sm text-muted-foreground line-through">
                  ₹{typeof productData.price === 'number' ? productData.price.toLocaleString() : 'N/A'}
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">per piece</span>
          </div>

          {/* Mobile Add to Cart Button */}
          <Button
            size="sm"
            variant="outline"
            className="md:hidden bg-transparent"
            onClick={handleAddToCart}
            disabled={isInCart}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

ProductCard.propTypes = {
  productData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    description: PropTypes.string,
    material: PropTypes.string,
    category: PropTypes.string,
    discount: PropTypes.number,
    offer: PropTypes.number,
  }).isRequired,
}

export default ProductCard
