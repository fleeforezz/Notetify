/**
 * @file utils.ts
 * @description Common utility functions, such as Tailwind class merging (cn).
 */

import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
