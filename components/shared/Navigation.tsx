"use client";

import { Zap, Menu } from "lucide-react";
import { FC } from "react";
import { Button } from "../ui/button";
import { ModeToggle } from "./ModeToggle";
import { motion } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import Link from "next/link";
import { UrlObject } from "url";

const Navigation: FC = () => {
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
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center gap-2">
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
            </Link>
          </motion.div>

          {/* Navigation Items */}
          <div className="flex items-center gap-6">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={item.href as unknown as UrlObject}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Buttons */}
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/auth">
              <Button variant="ghost" className="hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90">
                Get Started
              </Button>
            </Link>
            <ModeToggle />
          </motion.div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center justify-between">
          {/* Logo */}
          <motion.div className="flex items-center gap-2 cursor-pointer" whileTap={{ scale: 0.95 }}>
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Req Jet
              </span>
            </Link>
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
                  <SheetDescription>Powerful API testing platform</SheetDescription>
                </SheetHeader>

                {/* Mobile Navigation Items */}
                <div className="flex flex-col gap-4 mb-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href as unknown as UrlObject}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-lg font-medium py-3 px-4 hover:bg-muted/50 transition-colors"
                      >
                        {item.label}
                      </Button>
                    </Link>
                  ))}
                </div>

                {/* Mobile Auth Buttons */}
                <div className="flex flex-col gap-3 mt-auto">
                  <Link href="/auth">
                    <Button
                      variant="outline"
                      className="w-full py-3 text-base font-medium"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth">
                    <Button
                      className="w-full py-3 text-base font-medium bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                    >
                      Get Started
                    </Button>
                  </Link>
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
