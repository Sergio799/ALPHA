"use client";

import * as React from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputWithButtonProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onSubmit'> {
  onButtonClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  isLoading?: boolean;
}

const InputWithButton = React.forwardRef<HTMLInputElement, InputWithButtonProps>(
  ({ className, onButtonClick, isLoading, ...props }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (onButtonClick) {
        onButtonClick(e);
      }
    };

    return (
      <div className="relative w-full">
        <input
          ref={ref}
          className={cn(
            "flex h-12 w-full rounded-full border border-blue-900 bg-gray-700 backdrop-blur-xl pl-6 pr-14 py-2 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-sans text-white",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={handleClick}
          disabled={isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary hover:bg-primary/90 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send message"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    )
  }
)
InputWithButton.displayName = "InputWithButton"

export { InputWithButton }
