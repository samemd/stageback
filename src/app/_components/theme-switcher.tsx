"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

import { HiMoon, HiSun } from "react-icons/hi2";

export function ThemeSwitcher() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative flex rounded-full">
        <HiSun className="border-primary text-accent-foreground hover:bg-background h-9 w-9 scale-100 rotate-0 rounded-full border p-2 transition-all dark:scale-0 dark:-rotate-90" />
        <HiMoon className="border-primary text-accent-foreground hover:bg-background absolute h-9 w-9 scale-0 rotate-90 rounded-full border p-2 transition-all dark:scale-100 dark:rotate-0" />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
