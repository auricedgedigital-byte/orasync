type ClassValue = string | undefined | null | false | Record<string, boolean>

function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ").split(" ").filter(Boolean).join(" ")
}

export function cva<V extends Record<string, Record<string, string>>>(
  base: string,
  config?: {
    variants?: V
    defaultVariants?: { [K in keyof V]?: keyof V[K] }
  }
) {
  return (props?: { [K in keyof V]?: keyof V[K] } & { className?: string }) => {
    const variants = (config?.variants as any) || {}
    const defaultVariants = (config?.defaultVariants as any) || {}

    const classes = [base]
    if (props?.className) classes.push(props.className)

    const allProps = (props as any) || {}
    for (const key in allProps) {
      const value = allProps[key]
      if (key !== "className" && value && variants[key]?.[value]) {
        classes.push(variants[key][value])
      }
    }

    for (const key in defaultVariants) {
      const value = defaultVariants[key]
      if (!allProps[key] && variants[key]?.[value]) {
        classes.push(variants[key][value])
      }
    }

    return cn(...classes)
  }
}

export type VariantProps<T> = T extends (props?: infer P) => any ? Omit<P, "className"> : never
