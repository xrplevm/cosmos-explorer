"use client";

import { useTheme } from "next-themes";
import { IconSun as Sun, IconMoon as Moon } from "@tabler/icons-react";
import { Button } from "@cosmos-explorer/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); }}
      aria-label="Toggle theme"
    >
      <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:hidden" />
      <Moon className="hidden h-4 w-4 transition-all dark:block" />
    </Button>
  );
}
