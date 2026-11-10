"use client";

import { useTheme } from "next-themes";
import { Check, Monitor, Moon, Sun, SunMoon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const options = [
  { value: "dark", label: "Dark", icon: Moon },
  { value: "light", label: "Light", icon: Sun },
  { value: "system", label: "System", icon: Monitor },
] as const;

/**
 * Theme switcher.
 *
 * The trigger icon is deliberately static. Showing the *active* theme there
 * would mean reading a client-only value during the first render, which forces
 * either a hydration mismatch or a mount flag — and setting state in an effect
 * just to learn that the component mounted causes a cascading render. The
 * active option is instead marked inside the menu, which only renders once the
 * user opens it, long after hydration.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change colour theme">
          <SunMoon className="size-4" aria-hidden />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        {options.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
          >
            <option.icon className="size-4" aria-hidden />
            <span className="flex-1">{option.label}</span>
            {theme === option.value ? (
              <Check className="size-3.5 opacity-70" aria-label="Active" />
            ) : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
