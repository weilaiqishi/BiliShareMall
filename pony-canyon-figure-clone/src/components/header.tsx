"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Menu, ChevronDown } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function Header() {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-cyan-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                PF
              </div>
              <div className="ml-3">
                <div className="font-bold text-lg text-gray-900">PONY CANYON</div>
                <div className="font-bold text-lg text-gray-900">FIGURE</div>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-pink-500 transition-colors">
              首页
            </Link>
            <Link href="/info" className="text-gray-700 hover:text-pink-500 transition-colors">
              情报
            </Link>
            <Link href="/products" className="text-pink-500 font-medium">
              产品
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-pink-500 transition-colors">
              关于我们
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-pink-500 transition-colors">
              联系我们
            </Link>
          </div>

          {/* Language Selector */}
          <div className="flex items-center space-x-4">
            <Select defaultValue="zh-cn">
              <SelectTrigger className="w-32 border-gray-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zh-cn">简体中文</SelectItem>
                <SelectItem value="zh-tw">繁體中文</SelectItem>
                <SelectItem value="ja">日本語</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>

            {/* Desktop Menu Button */}
            <div className="hidden md:flex items-center text-gray-700">
              <span className="mr-2">菜单</span>
              <div className="flex flex-col space-y-0.5">
                <div className="w-4 h-0.5 bg-gray-400"></div>
                <div className="w-4 h-0.5 bg-gray-400"></div>
                <div className="w-4 h-0.5 bg-gray-400"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
