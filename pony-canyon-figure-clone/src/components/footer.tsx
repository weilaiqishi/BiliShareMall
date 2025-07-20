import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold text-lg mb-4">首页</h3>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">情报</h3>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4 text-pink-500">• 产品</h3>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">关于我们</h3>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="font-bold text-lg mb-6">联系我们 ↗</h3>
        </div>

        {/* Social Media */}
        <div className="mb-8">
          <h4 className="text-gray-400 text-sm mb-4 tracking-wider">PONYCANYON SHOP OFFICIAL</h4>
          <div className="flex space-x-4">
            <Link href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
              <Twitter className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
              <Facebook className="w-5 h-5" />
            </Link>
            <Link href="#" className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
              <Instagram className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Pony Canyon Shop Logo */}
        <div className="mb-8">
          <div className="bg-white text-gray-900 px-6 py-3 rounded inline-block font-bold text-lg">
            PONY CANYON SHOP
          </div>
        </div>

        {/* Main Logo */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-2xl mr-4">
              PF
            </div>
            <div>
              <div className="font-bold text-2xl">PONY CANYON</div>
              <div className="font-bold text-2xl">FIGURE</div>
            </div>
          </div>
        </div>

        {/* Language Links */}
        <div className="flex flex-wrap gap-6 mb-8 text-sm">
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">日本語</Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">English</Link>
          <Link href="#" className="text-pink-500 font-medium">简体中文</Link>
          <Link href="#" className="text-gray-400 hover:text-white transition-colors">繁體中文</Link>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-gray-400 text-sm mb-4">© PONY CANYON.</p>
          <div className="flex items-center justify-center">
            <button className="text-gray-400 hover:text-white transition-colors flex items-center text-sm">
              <span className="mr-2">返回顶部</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
