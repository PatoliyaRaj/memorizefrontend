"use client";

import { Button } from "@/components/ui/button";

export default function ThemeToggle() {
  const toggle = () => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark");
    }
  };

  return (
    <Button variant="ghost" onClick={toggle}>
      Toggle Dark Mode
    </Button>
  );
}
