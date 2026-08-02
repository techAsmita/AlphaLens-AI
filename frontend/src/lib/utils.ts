type ClassValue = string | number | boolean | undefined | null;

/**
 * Joins class names together, filtering out falsy values.
 * Minimal alternative to clsx/tailwind-merge for this project's needs.
 */
export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(" ");
}
