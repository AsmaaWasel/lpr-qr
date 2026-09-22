"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800"
        aria-label="تغيير المظهر"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="
        flex items-center justify-center
        w-10 h-10
        rounded-full
        bg-gray-100 dark:bg-gray-800
        text-gray-700 dark:text-yellow-400
        hover:bg-gray-200 dark:hover:bg-gray-700
        transition-all duration-300
      "
      aria-label={isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الداكن"}
    >
      {isDark ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}
