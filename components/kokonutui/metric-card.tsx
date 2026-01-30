import React, { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronRight, Activity } from "@/components/icons"
interface MetricCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: any
  onClick?: () => void
  detailsContent?: React.ReactNode
  isClickable?: boolean
  className?: string
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  onClick,
  detailsContent,
  isClickable = true,
  className,
}: MetricCardProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleClick = () => {
    if (isClickable) {
      setIsOpen(true)
      onClick?.()
    }
  }

  return (
    <>
      <Card
        className={`group relative overflow-hidden flex flex-col justify-between p-5 rounded-2xl transition-all duration-300 border-border/50 bg-background hover:bg-muted/50 ${isClickable ? "cursor-pointer hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 active:scale-[0.98]" : ""
          } ${className}`}
        onClick={handleClick}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-primary/10 rounded-xl transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="h-5 w-5 text-primary transition-colors group-hover:text-primary-foreground" />
          </div>
          <div className="h-8 w-8 rounded-full border border-border/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>

        <div>
          <div className="text-sm font-bold text-muted-foreground/80 tracking-tight uppercase mb-1">
            {title}
          </div>
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-black text-foreground tracking-tighter">{value}</div>
            <div className="text-[10px] font-bold text-green-600 bg-green-500/10 px-1.5 py-0.5 rounded-md border border-green-500/20">
              {subtitle}
            </div>
          </div>
        </div>

        {/* Subtle background glow effect */}
        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
      </Card>

      {isClickable && (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="max-w-2xl max-h-[85vh] p-0 overflow-hidden rounded-3xl border-border/40 shadow-2xl">
            <div className="bg-primary/5 p-8 pb-6 border-b border-border/40">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3 text-2xl font-black tracking-tighter">
                  <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  {title}
                </DialogTitle>
                <p className="text-sm font-medium text-muted-foreground mt-2">{subtitle}</p>
              </DialogHeader>
            </div>
            <div className="p-8 pt-6 overflow-y-auto">
              {detailsContent || (
                <div className="text-center text-muted-foreground py-12">
                  <Activity className="h-12 w-12 text-muted/30 mx-auto mb-4" />
                  <p className="text-lg font-bold">Comprehensive analysis coming soon</p>
                  <p className="text-sm">We are processing more data for {title}.</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
