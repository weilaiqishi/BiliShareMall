"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { useState } from "react"
import { ZoomIn, Plus } from "lucide-react"

// Mock product data
const product = {
  id: "1936",
  title: "初音未来 花舞灵风",
  price: "22,500日元",
  status: "销售结束",
  images: [
    "https://ext.same-assets.com/2246310015/3614750187.jpeg",
    "https://ext.same-assets.com/2246310015/1374352697.png",
    "https://ext.same-assets.com/2246310015/3210537445.png",
    "https://ext.same-assets.com/2246310015/3919472177.png",
    "https://ext.same-assets.com/2246310015/1246589265.png",
    "https://ext.same-assets.com/2246310015/3052479739.png"
  ],
  details: {
    series: "初音未来",
    preOrderPeriod: "日本时间2025年3月18日(星期二)AM11:00～2025年5月26日(星期一) PM23:59",
    releaseDate: "预计于2025年11月",
    status: "销售结束",
    specs: "ABS&PVC制涂装完成品 1/7比例 附专用底座",
    size: "全高约240mm",
    janCode: "BRZP.16232",
    ean: "4524135236418",
    manufacturer: "Wonderful Works",
    sculptor: "Kazuhiro(Wonderful Works)",
    colorDesign: "KON(Shokotto)",
    producer: "Amaterasu",
    distributor: "PONY CANYON"
  },
  features: [
    {
      title: "以透明材质呈现轻盈感",
      description: "羽翼、袖套与裙摆上部皆采用渐变涂装的透明部件，带来更加轻盈且华丽的视觉效果。",
      image: "https://ext.same-assets.com/2246310015/1374352697.png"
    },
    {
      title: "闪耀夺目的宝石要素",
      description: "精灵羽翼和耳机融入了宝石要素的设计。随着角度变化会微微闪烁，展现细腻的光彩。",
      image: "https://ext.same-assets.com/2246310015/3210537445.png"
    },
    {
      title: "楚楚动人的表情搭配缤纷妆容",
      description: "双眸呈现鲜艳的多色高光，并搭配彩色睫毛膏增添华丽感。嘴唇则使用单色唇彩，进一步凸显其楚楚动人的表情。",
      image: "https://ext.same-assets.com/2246310015/3919472177.png"
    },
    {
      title: "重现舞台上歌唱舞动的动感魅力",
      description: "服装以在舞台上歌唱舞蹈的初音未来为灵感，基于原画插图进行重新设计。飘逸的长发也特别增添蓬松感，营造出舞台上的动感氛围。",
      image: "https://ext.same-assets.com/2246310015/1246589265.png"
    }
  ]
}

const relatedProducts = [
  {
    id: "1497",
    title: "《碧蓝航线》萨沃伊亲王 沉醉于夜",
    price: "25,273日元",
    image: "https://ext.same-assets.com/2246310015/828980480.png",
    status: "sold-out" as const,
    href: "/products/1497"
  }
]

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            {/* Main Image */}
            <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-cyan-100 rounded-lg overflow-hidden mb-4">
              <Image
                src={product.images[selectedImage]}
                alt={product.title}
                fill
                className="object-cover"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-6 gap-2">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden ${
                    selectedImage === index ? 'ring-2 ring-pink-500' : ''
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            <div className="mb-4">
              <Badge variant="destructive" className="bg-pink-500 hover:bg-pink-600 text-white mb-4">
                • {product.status}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            </div>

            {/* Shipping Info */}
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <Image
                  src="https://ext.same-assets.com/2246310015/2045057990.png"
                  alt="We ship worldwide"
                  width={200}
                  height={40}
                  className="h-8 w-auto"
                />
              </div>
              <p className="text-sm text-gray-600">
                ※目前我们无法将商品配送至以色列、乌克兰、白俄罗斯、俄罗斯联邦。
              </p>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <span className="font-medium text-gray-700">作品标题</span>
                <span className="col-span-2 text-gray-900">{product.details.series}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <span className="font-medium text-gray-700">价格</span>
                <div className="col-span-2">
                  <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                  <div className="mt-2">
                    <Button variant="outline" size="sm">
                      汇率换算工具
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">※请注意，此处提供的价格仅供参考。</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <span className="font-medium text-gray-700">预购时间</span>
                <span className="col-span-2 text-gray-900 text-sm">{product.details.preOrderPeriod}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <span className="font-medium text-gray-700">发售日</span>
                <span className="col-span-2 text-gray-900">{product.details.releaseDate}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3 border-b">
                <span className="font-medium text-gray-700">销售状况</span>
                <span className="col-span-2 text-gray-900">{product.details.status}</span>
              </div>

              <div className="grid grid-cols-3 gap-4 py-3">
                <span className="font-medium text-gray-700">规格</span>
                <span className="col-span-2 text-gray-900">{product.details.specs}</span>
              </div>
            </div>

            <Button className="w-full mt-6 bg-gray-200 text-gray-700 hover:bg-gray-300">
              查看更多 <Plus className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">特色</h2>

          <div className="space-y-16">
            {product.features.map((feature, index) => (
              <div key={index} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="text-cyan-500 font-bold text-sm mb-2">
                    FEATURE {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-700 leading-relaxed">{feature.description}</p>
                </div>
                <div className={index % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="relative aspect-square bg-gradient-to-br from-pink-100 to-cyan-100 rounded-lg overflow-hidden">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                    <Button
                      size="icon"
                      variant="secondary"
                      className="absolute bottom-4 right-4 bg-black/50 hover:bg-black/70 text-white"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Video Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">视频</h2>
          <div className="bg-gray-200 rounded-lg aspect-video flex items-center justify-center">
            <div className="text-center text-gray-600">
              <p className="text-lg mb-2">【预售时间为至5月26日】初音未来 花舞灵风 1/7比例手办</p>
            </div>
          </div>
        </section>

        {/* Related Products */}
        <section>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                status={product.status}
                href={product.href}
              />
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" className="px-8">
              产品 →
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
