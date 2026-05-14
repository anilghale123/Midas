import { cn } from "@/lib/utils"

const Container = ({ children, className, size = "default", ...props }) => {
  const sizes = {
    default: "max-w-7xl",
    wide: "max-w-screen-xl",
    narrow: "max-w-5xl",
  }

  return (
    <div
      className={cn("mx-auto px-5 sm:px-6 lg:px-8", sizes[size], className)}
      {...props}
    >
      {children}
    </div>
  )
}

export default Container
