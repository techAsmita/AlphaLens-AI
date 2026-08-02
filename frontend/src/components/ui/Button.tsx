import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost";

// Framer Motion's event props (onDrag, onAnimationStart, etc.) have
// different signatures than the native DOM events of the same name, so
// they're omitted here in favor of motion.button's own typings.
type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd"
>;

interface ButtonProps extends NativeButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  icon?: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-primary text-background hover:bg-primary/90",
  secondary:
    "bg-transparent text-text border border-white/15 hover:border-primary/60 hover:text-primary",
  ghost: "bg-transparent text-muted hover:text-text",
};

/**
 * Standard call-to-action button. Use `variant="primary"` for the main
 * action on a screen, `secondary` for supporting actions, `ghost` for
 * low-emphasis links styled as buttons.
 */
export function Button({
  children,
  variant = "primary",
  icon,
  className,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5",
        "text-sm font-semibold font-mono-tight tracking-wide transition-colors duration-200",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
      {icon}
    </motion.button>
  );
}
