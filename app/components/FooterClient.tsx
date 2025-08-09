'use client'

import { useTheme } from "../context/ThemeContext";

export function FooterClient() {
  const { resolvedTheme } = useTheme();
  
  // This component can be used for any client-side theme logic
  // Currently it's just consuming the theme, but you could add
  // theme-dependent logic here if needed
  
  return null; // This component doesn't render anything visible
} 