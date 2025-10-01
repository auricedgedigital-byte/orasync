"use client"

import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

const MENU_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Blog", href: "#" },
  { label: "Support", href: "#" },
] as const

interface NavMenuItemsProps {
  className?: string
}

const NavMenuItems = ({ className }: NavMenuItemsProps) => (
  <div className={`flex flex-col md:flex-row gap-1 ${className ?? ""}`}>
    {MENU_ITEMS.map(({ label, href }) => (
      <Link key={label} href={href}>
        <Button variant="ghost" className="w-full md:w-auto">
          {label}
        </Button>
      </Link>
    ))}
  </div>
)

export function LpNavbar1() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  return (
    <nav className="sticky top-0 z-50 bg-background py-3.5 md:py-4 isolate border-b">
      <div className="container relative px-6 flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 m-auto">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            className="size-9 flex items-center justify-center md:hidden"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-row gap-5 w-full justify-end">
          <NavMenuItems />
          <Link href="https://app.orasync.com/login">
            <Button variant="ghost">Login</Button>
          </Link>
          <Link href="https://app.orasync.com/signup">
            <Button>Get Started Free</Button>
          </Link>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden flex flex-col gap-5 w-full justify-end pb-2.5">
            <NavMenuItems />
            <Link href="https://app.orasync.com/login">
              <Button variant="ghost" className="w-full">
                Login
              </Button>
            </Link>
            <Link href="https://app.orasync.com/signup">
              <Button className="w-full">Get Started Free</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}
