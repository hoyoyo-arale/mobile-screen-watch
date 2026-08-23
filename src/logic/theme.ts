import type { Theme } from "../types/app";

export const toggleTheme = (theme: Theme): Theme =>
  theme === "dark" ? "light" : "dark";
