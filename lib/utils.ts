import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function stripSectorSuffix(name: string) {
  return name.replace(/\s*概念股$/, "");
}
