import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-4xl">
              PF
            </div>
          </div>

          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            PONY CANYON FIGURE
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            通过高品质的质量和优质的客户服务，为全球粉丝提供高满意度商品的官方网站
          </p>

          <div className="space-x-4">
            <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600">
              <Link href="/products">浏览产品</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/about">了解更多</Link>
            </Button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-pink-500">高</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">高品质</h3>
            <p className="text-gray-600">精工细作，每一个细节都追求完美</p>
          </div>

          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-cyan-500">全</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">全球配送</h3>
            <p className="text-gray-600">将精美手办送达世界各地</p>
          </div>

          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl font-bold text-purple-500">专</span>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">专业服务</h3>
            <p className="text-gray-600">提供专业的客户服务支持</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
