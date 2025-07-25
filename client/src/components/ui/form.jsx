import * as React from "react"
import { cn } from "@/lib/utils"

const Form = ({ className, ...props }) => (
  <form
    className={cn("space-y-6", className)}
    {...props}
  />
)
Form.displayName = "Form"

const FormItem = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("space-y-2", className)} {...props} />
))
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "block text-sm font-medium text-gray-700",
      className
    )}
    {...props}
  />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(({ ...props }, ref) => (
  <div ref={ref} className="mt-1" {...props} />
))
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}
