import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

/**
 * Centers content and constrains it to the site's max reading width,
 * with responsive horizontal padding.
 */
export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <div
      className={cn("mx-auto w-full max-w-container px-6 sm:px-8 lg:px-10", className)}
      {...props}
    >
      {children}
    </div>
  );
}
