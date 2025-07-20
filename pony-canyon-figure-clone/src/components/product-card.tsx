import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: string
  title: string
  price: string
  image: string
  status?: "sold-out" | "available"
  href: string
}

export function ProductCard({ id, title, price, image, status = "available", href }: ProductCardProps) {
  return (
    <Link href={href} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        {/* Product Image */}
        <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-cyan-100 overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {status === "sold-out" && (
            <div className="absolute top-3 left-3">
              <Badge variant="destructive" className="bg-pink-500 hover:bg-pink-600 text-white">
                销售结束
              </Badge>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4">
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
            {title}
          </h3>
          <p className="text-lg font-bold text-gray-900">{price}</p>
        </div>
      </div>
    </Link>
  )
}
