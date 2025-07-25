"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import Image from "next/image"
import PropTypes from "prop-types"

const ProductCard = ({ productData }) => {
  const router = useRouter()

  const stringSlicer = (str, limit) => {
    if (str.length > limit) {
      return str.slice(0, limit) + "..."
    }
    return str
  }

  return (
    <Card
      className="group cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-0 shadow-md"
      onClick={() => router.push("/productdetails/" + productData._id)}
    >
      <CardContent className="p-0">
        {/* Image Section */}
        <div className="relative overflow-hidden rounded-t-lg bg-gray-50">
          <div className="aspect-square relative">
            <Image
              src={`${process.env.NEXT_PUBLIC_API_URL}/${productData.image}`}
              alt={productData.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          </div>
          {productData.offer && (
            <Badge variant="destructive" className="absolute top-3 right-3 bg-red-500 hover:bg-red-600">
              {productData.offer}% OFF
            </Badge>
          )}
        </div>

        {/* Content Section */}
        <div className="p-4 space-y-3">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight text-gray-900 group-hover:text-blue-600 transition-colors">
              {stringSlicer(productData.title, 30)}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{stringSlicer(productData.description, 40)}</p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {productData.material}
            </Badge>
            {productData.price && (
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">₹{productData.price.toLocaleString()}</p>
                <p className="text-xs text-gray-500">per piece</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

ProductCard.propTypes = {
  productData: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    material: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    offer: PropTypes.number,
  }).isRequired,
}

export default ProductCard
