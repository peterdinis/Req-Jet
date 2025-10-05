"use client";

import { Zap, Menu} from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

const Navigation: FC = () => {
  const router = useRouter();

  const navItems = [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Req Jet
            </span>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.button
                key={item.href}
                className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                onClick={() => router.push(item.href)}
                whileHover={{ scale: 1.05, color: "hsl(var(--primary))" }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Right Side - Buttons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
              className="hidden sm:inline-flex"
            >
              Sign In
            </Button>
            <Button
              onClick={() => router.push("/auth")}
              className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
            >
              Get Started
            </Button>
            <ModeToggle />
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => router.push("/")}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
             Req Jet
            </span>
          </motion.div>

          {/* Hamburger Menu with Sheet */}
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="relative z-60">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 sm:w-96">
                <SheetHeader className="text-left mb-8">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                      <Zap className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      Req Jet
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Powerful API testing platform
                  </SheetDescription>
                </SheetHeader>

                {/* Mobile Navigation Items */}
                <div className="flex flex-col gap-4 mb-8">
                  {navItems.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start text-lg font-medium py-3 px-4 hover:bg-muted/50 transition-colors"
                      onClick={() => router.push(item.href)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/login")}
                    className="w-full py-3 text-base font-medium"
                  >
                    Sign In
                  </Button>
                  <Button
                    onClick={() => router.push("/auth")}
                    className="w-full py-3 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                  >
                    Get Started
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
