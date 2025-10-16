"use client";

import {
  Zap,
  Menu,
  Server,
  Folder,
  FileText,
  Code,
  Play,
  Shield,
  GitBranch,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUp,
} from "lucide-react";
import { FC, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { UrlObject } from "url";

/**
 * HeroWrapper component displays the top navigation, hero sections,
 * features, documentation previews, footer, and scroll-to-top button.
 * It supports both desktop and mobile layouts with animations and smooth scrolling.
 */
const HeroWrapper: FC = () => {
  /** Next.js router instance for navigation */
  const router = useRouter();

  /** State to track whether the "Scroll to Top" button should be visible */
  const [showScrollTop, setShowScrollTop] = useState(false);

  /** Navigation links for the hero section */
  const navItems = [
    { label: "Features", href: "#features" },
    { label: "Documentation", href: "#docs" },
    { label: "Pricing", href: "/pricing" },
  ];

  /** List of features to display in the Features section */
  const features = [
    {
      icon: Server,
      title: "Instant Testing",
      description:
        "Test any API endpoint with real-time responses and detailed analytics",
    },
    {
      icon: Folder,
      title: "Smart Collections",
      description: "Organize your APIs with intelligent folders and tags",
    },
    {
      icon: Code,
      title: "Code Generation",
      description: "Generate client code in multiple languages automatically",
    },
    {
      icon: Shield,
      title: "Secure Environment",
      description: "Enterprise-grade security with encrypted data storage",
    },
    {
      icon: Play,
      title: "Automated Testing",
      description: "Schedule and automate your API test suites",
    },
    {
      icon: GitBranch,
      title: "Version Control",
      description: "Track changes and collaborate with team members",
    },
  ];

  /** Footer links organized by category */
  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Documentation", href: "#docs" },
      { name: "Pricing", href: "/pricing" },
      { name: "API Status", href: "/status" },
    ],
    company: [
      { name: "About", href: "/about" },
      { name: "Blog", href: "/blog" },
      { name: "Careers", href: "/careers" },
      { name: "Contact", href: "/contact" },
    ],
    legal: [
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
      { name: "Security", href: "/security" },
      { name: "Compliance", href: "/compliance" },
    ],
  };

  /** Social media links with icons */
  const socialLinks = [
    { icon: Github, href: "https://github.com", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: "mailto:hello@reqjet.com", label: "Email" },
  ];

  /**
   * Handles scroll events to show/hide the scroll-to-top button
   */
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /**
   * Scrolls smoothly to a section or navigates to a route
   * @param sectionId - The section ID (starting with "#") or route path
   */
  const scrollToSection = (sectionId: string) => {
    if (sectionId.startsWith("#")) {
      const element = document.querySelector(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(sectionId as any);
    }
  };

  /** Scrolls the window smoothly to the top */
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/** Navigation Bar */}
      <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3">
          {/** Desktop Navigation */}
          <div className="hidden md:flex items-center justify-between">
            {/** Logo */}
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

            {/** Navigation Items */}
            <div className="flex items-center gap-6">
              {navItems.map((item, index) => (
                <motion.button
                  key={item.href}
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
                  onClick={() => scrollToSection(item.href)}
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

            {/** Sign In / Get Started Buttons */}
            <motion.div
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="ghost"
                onClick={() => router.push("/auth")}
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
            </motion.div>
          </div>

          {/** Mobile Navigation */}
          <div className="flex md:hidden items-center justify-between">
            {/** Mobile Logo */}
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

            {/** Mobile Hamburger Menu */}
            <div className="flex items-center gap-2">
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
                      Lightning-fast API testing platform
                    </SheetDescription>
                  </SheetHeader>

                  {/** Mobile Navigation Items */}
                  <div className="flex flex-col gap-4 mb-8">
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        className="w-full justify-start text-lg font-medium py-3 px-4 hover:bg-muted/50 transition-colors"
                        onClick={() => scrollToSection(item.href)}
                      >
                        {item.label}
                      </Button>
                    ))}
                  </div>

                  {/** Mobile Auth Buttons */}
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button
                      variant="outline"
                      onClick={() => router.push("/auth")}
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

      {/** Features Section */}
      <section
        id="features"
        className="py-20 bg-gradient-to-b from-background to-muted/30"
      >
        {/* Features grid and animations */}
      </section>

      {/** Documentation Section */}
      <section id="docs" className="py-20 bg-muted/20">
        {/* Documentation guides and CTA */}
      </section>

      {/** Footer */}
      <footer className="bg-background border-t border-border">
        {/* Animated footer with social links and site links */}
      </footer>

      {/** Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.9 }}
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
};

export default HeroWrapper;
