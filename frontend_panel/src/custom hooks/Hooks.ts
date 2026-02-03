// Hooks.ts
import { useContext } from "react";
import { ThemeContextType } from "../types/theme/theme-types";
import { ThemeContext } from "../context/ThemeContext";

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};





