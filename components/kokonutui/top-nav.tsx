"use client"

import { useRouter, usePathname } from "next/navigation"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Bell, ChevronRight, Search } from "@/components/icons"
import Profile01 from "./profile-01"
import Link from "next/link"
import { ThemeToggle } from "../theme-toggle"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface BreadcrumbItem {
  label: string
  href?: string
}

export default function TopNav() {
  const router = useRouter()
  const pathname = usePathname()
  const { data: session, status } = useSession()

  const getBreadcrumbs = (): BreadcrumbItem[] => {
    const pathSegments = pathname.split("/").filter(Boolean)
    const breadcrumbs: BreadcrumbItem[] = [{ label: "OraSync", href: "/dashboard" }]

    if (pathSegments.length > 0) {
      const lastSegment = pathSegments[pathSegments.length - 1]
      const label = lastSegment
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      breadcrumbs.push({ label })
    }

    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs()

  const handleNotificationClick = () => {
    router.push("/unified-inbox")
  }

  return (
    <nav className="px-4 sm:px-8 flex items-center justify-between border-b border-border bg-background/60 backdrop-blur-md h-full sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center space-x-1.5 text-xs">
          {breadcrumbs.map((item, index) => (
            <div key={item.label} className="flex items-center">
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50 mx-0.5" />}
              {item.href ? (
                <Link href={item.href} className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold">{item.label}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 max-w-lg mx-8 hidden lg:block">
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
          <Input
            placeholder="Search patients, campaigns, files..."
            className="pl-11 pr-4 py-2.5 bg-muted/40 border-transparent focus-visible:bg-background focus-visible:ring-1 focus-visible:ring-primary/20 focus-visible:border-primary/30 rounded-2xl transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        <div className="flex items-center p-1 bg-muted/50 rounded-xl border border-border/50">
          <button
            type="button"
            className="p-2 hover:bg-background hover:text-primary rounded-lg transition-all relative group"
            onClick={handleNotificationClick}
          >
            <Bell className="h-[18px] w-[18px] text-muted-foreground group-hover:text-primary" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full border-2 border-background" />
          </button>

          <div className="w-[1px] h-4 bg-border mx-1" />

          <div className="p-0.5">
            <ThemeToggle />
          </div>
        </div>

        <div className="h-8 w-[1px] bg-border mx-1 hidden sm:block" />

        {status === "authenticated" ? (
          <DropdownMenu>
            <DropdownMenuTrigger className="focus:outline-none group">
              <div className="flex items-center gap-3 cursor-pointer p-1 pr-2 rounded-xl hover:bg-muted/50 transition-all">
                <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-sm border border-primary/20 shadow-sm transition-transform group-hover:scale-105">
                  {session.user?.name?.charAt(0) || session.user?.email?.charAt(0) || "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-foreground leading-none mb-1 truncate max-w-[100px]">
                    {session.user?.name || "User"}
                  </p>
                  <p className="text-[10px] text-muted-foreground leading-none truncate max-w-[100px]">
                    {session.user?.email}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              sideOffset={12}
              className="w-[280px] sm:w-80 p-0 overflow-hidden bg-background border-border rounded-2xl shadow-2xl shadow-primary/10"
            >
              <Profile01 />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button variant="default" size="sm" className="rounded-xl px-5 font-bold shadow-lg shadow-primary/20">
              Sign In
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
