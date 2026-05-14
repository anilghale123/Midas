import { cn } from "@/lib/utils"

const tones = {
  default: "bg-surface",
  paper: "bg-surface-paper",
  alt: "bg-surface-alt",
  dark: "bg-surface-dark text-white",
  primary: "bg-primary-500 text-white",
}

const SectionWrapper = ({
  children,
  className,
  tone = "default",
  as: Tag = "section",
  ...props
}) => {
  return (
    <Tag
      className={cn(
        "py-14 sm:py-20 lg:py-24 xl:py-28",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  )
}

export default SectionWrapper
