"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProductCard } from "@/components/product-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"

// Mock product data
const products = [
  {
    id: "1936",
    title: "初音未来 花舞灵风",
    price: "22,500日元",
    image: "https://ext.same-assets.com/2246310015/3614750187.jpeg",
    status: "sold-out" as const,
    href: "/products/1936"
  },
  {
    id: "1497",
    title: "《碧蓝航线》萨沃伊亲王 沉醉于夜",
    price: "25,273日元",
    image: "https://ext.same-assets.com/2246310015/828980480.png",
    status: "sold-out" as const,
    href: "/products/1497"
  },
  {
    id: "1304",
    title: "TV动画《2.5次元的诱惑》莉莉艾露 天使学校篇 练习服/理理沙",
    price: "20,909日元",
    image: "https://ext.same-assets.com/2246310015/279971199.png",
    status: "sold-out" as const,
    href: "/products/1304"
  },
  {
    id: "1271",
    title: "TV动画《魔都精兵的奴隶》羽前京香 内衣style",
    price: "20,727日元",
    image: "https://ext.same-assets.com/2246310015/3187632536.png",
    status: "sold-out" as const,
    href: "/products/1271"
  },
  {
    id: "1346",
    title: "TV动画《进击的巨人》人类最强士兵 利威尔",
    price: "38,182日元",
    image: "https://ext.same-assets.com/2246310015/351574836.png",
    status: "sold-out" as const,
    href: "/products/1346"
  },
  {
    id: "1365",
    title: "《少女前线》索米 仲夏夜的精灵 重伤Ver.",
    price: "21,636日元",
    image: "https://ext.same-assets.com/2246310015/3220040244.png",
    status: "sold-out" as const,
    href: "/products/1365"
  },
  {
    id: "1357",
    title: "《少女前线》UKM-2000 酸甜水物语 1/7 比例手办",
    price: "27,091日元",
    image: "https://ext.same-assets.com/2246310015/444757871.png",
    status: "sold-out" as const,
    href: "/products/1357"
  },
  {
    id: "1371",
    title: "《少女前线》NTW-20 贵族体验馆 1/6比例手办",
    price: "27,800日元",
    image: "https://ext.same-assets.com/2246310015/2375109314.png",
    status: "sold-out" as const,
    href: "/products/1371"
  },
  {
    id: "1282",
    title: "《碧蓝航线》能代 1/7比例手办",
    price: "31,800日元",
    image: "https://ext.same-assets.com/2246310015/1039253185.png",
    status: "sold-out" as const,
    href: "/products/1282"
  },
  {
    id: "1379",
    title: "《SSSS.DYNAZENON》南梦芽 1/6比例模型",
    price: "18,164日元",
    image: "https://ext.same-assets.com/2246310015/4178670250.png",
    status: "sold-out" as const,
    href: "/products/1379"
  }
]

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">产品</h1>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">类别</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="figures">手办</SelectItem>
                  <SelectItem value="models">模型</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">作品标题</label>
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="全部" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部</SelectItem>
                  <SelectItem value="miku">初音未来</SelectItem>
                  <SelectItem value="azurlane">碧蓝航线</SelectItem>
                  <SelectItem value="girlsfrontline">少女前线</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">搜索</label>
              <div className="relative">
                <Input
                  placeholder="搜索关键词"
                  className="pr-10"
                />
                <Button size="icon" variant="ghost" className="absolute right-0 top-0 h-full">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Button className="w-full bg-gray-800 hover:bg-gray-900 text-white rounded-full">
            缩小范围
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
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
      </main>

      <Footer />
    </div>
  )
}
