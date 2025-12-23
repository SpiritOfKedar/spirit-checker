"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="w-9 h-9">
                <div className="w-4 h-4" />
            </Button>
        );
    }

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="w-9 h-9 hover:bg-muted transition-colors"
        >
            {theme === "dark" ? (
                <Moon className="w-4 h-4 text-foreground/80" />
            ) : (
                <Sun className="w-4 h-4 text-foreground/80" />
            )}
            <span className="sr-only">Toggle theme</span>
        </Button>
    );
}
