"use client";

import { Zap, Menu, Server, Folder, FileText, Code, Play, Shield, GitBranch, Github, Twitter, Linkedin, Mail, ArrowUp } from "lucide-react";
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

const HeroWrapper: FC = () => {
    const router = useRouter();
    const [showScrollTop, setShowScrollTop] = useState(false);
    
    const navItems = [
        { label: "Features", href: "#features" },
        { label: "Documentation", href: "#docs" },
        { label: "Pricing", href: "/pricing" },
    ];

    const features = [
        {
            icon: Server,
            title: "Instant Testing",
            description: "Test any API endpoint with real-time responses and detailed analytics"
        },
        {
            icon: Folder,
            title: "Smart Collections",
            description: "Organize your APIs with intelligent folders and tags"
        },
        {
            icon: Code,
            title: "Code Generation",
            description: "Generate client code in multiple languages automatically"
        },
        {
            icon: Shield,
            title: "Secure Environment",
            description: "Enterprise-grade security with encrypted data storage"
        },
        {
            icon: Play,
            title: "Automated Testing",
            description: "Schedule and automate your API test suites"
        },
        {
            icon: GitBranch,
            title: "Version Control",
            description: "Track changes and collaborate with team members"
        }
    ];

    const footerLinks = {
        product: [
            { name: "Features", href: "#features" },
            { name: "Documentation", href: "#docs" },
            { name: "Pricing", href: "/pricing" },
            { name: "API Status", href: "/status" }
        ],
        company: [
            { name: "About", href: "/about" },
            { name: "Blog", href: "/blog" },
            { name: "Careers", href: "/careers" },
            { name: "Contact", href: "/contact" }
        ],
        legal: [
            { name: "Privacy", href: "/privacy" },
            { name: "Terms", href: "/terms" },
            { name: "Security", href: "/security" },
            { name: "Compliance", href: "/compliance" }
        ]
    };

    const socialLinks = [
        { icon: Github, href: "https://github.com", label: "GitHub" },
        { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
        { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
        { icon: Mail, href: "mailto:hello@reqjet.com", label: "Email" }
    ];

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (sectionId: string) => {
        if (sectionId.startsWith('#')) {
            const element = document.querySelector(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            router.push(sectionId);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-3">
                    {/* Desktop HeroWrapper */}
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

                        {/* HeroWrapper Items */}
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
                        </motion.div>
                    </div>

                    {/* Mobile HeroWrapper */}
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
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="relative z-60"
                                    >
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

                                    {/* Mobile HeroWrapper Items */}
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

            {/* Features Section */}
            <section id="features" className="py-20 bg-gradient-to-b from-background to-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center max-w-3xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Powerful Features for{" "}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Modern Developers
                            </span>
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground mb-8 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            Everything you need to test, debug, and document your APIs efficiently
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                viewport={{ once: true }}
                                whileHover={{ 
                                    y: -8,
                                    transition: { duration: 0.3 }
                                }}
                                className="group bg-background border border-border rounded-2xl p-6 hover:shadow-xl transition-all duration-300 hover:border-primary/30"
                            >
                                <div className="flex flex-col h-full">
                                    <motion.div
                                        className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4 group-hover:from-primary/20 group-hover:to-accent/20 transition-colors"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <feature.icon className="w-6 h-6 text-primary" />
                                    </motion.div>
                                    <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground leading-relaxed flex-grow">
                                        {feature.description}
                                    </p>
                                    <motion.div
                                        className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-primary to-accent mt-4 transition-all duration-300"
                                        whileHover={{ width: "100%" }}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Documentation Section */}
            <section id="docs" className="py-20 bg-muted/20">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center max-w-4xl mx-auto mb-16"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                    >
                        <motion.h2
                            className="text-4xl md:text-5xl font-bold tracking-tight mb-6"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                        >
                            Comprehensive{" "}
                            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                Documentation
                            </span>
                        </motion.h2>
                        <motion.p
                            className="text-xl text-muted-foreground mb-8 leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            viewport={{ once: true }}
                        >
                            Learn how to make the most of Req Jet with our detailed guides and examples
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            viewport={{ once: true }}
                        >
                            <div className="space-y-6">
                                <motion.div
                                    className="p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                        <FileText className="w-6 h-6 text-primary" />
                                        Quick Start Guide
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Get up and running in minutes with our step-by-step tutorial.
                                    </p>
                                    <Button variant="outline" onClick={() => router.push("/docs/quickstart")}>
                                        Read Guide
                                    </Button>
                                </motion.div>

                                <motion.div
                                    className="p-6 bg-background rounded-2xl border border-border hover:shadow-lg transition-all duration-300"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center gap-3">
                                        <Code className="w-6 h-6 text-primary" />
                                        API Reference
                                    </h3>
                                    <p className="text-muted-foreground mb-4">
                                        Complete reference for all endpoints, parameters, and responses.
                                    </p>
                                    <Button variant="outline" onClick={() => router.push("/docs/api")}>
                                        View Reference
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-border">
                                <motion.div
                                    className="text-center"
                                    animate={{
                                        y: [0, -10, 0],
                                    }}
                                    transition={{
                                        duration: 4,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                        <Zap className="w-10 h-10 text-primary-foreground" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4">Ready to Start?</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Join thousands of developers already using Req Jet for their API testing needs.
                                    </p>
                                    <Button 
                                        size="lg"
                                        onClick={() => router.push("/auth")}
                                        className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
                                    >
                                        Start Testing Now
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Animated Footer */}
            <footer className="bg-background border-t border-border">
                <div className="container mx-auto px-4 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12"
                    >
                        {/* Brand Column */}
                        <motion.div 
                            className="lg:col-span-2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            viewport={{ once: true }}
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-primary-foreground" />
                                </div>
                                <span className="font-bold text-2xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                                    Req Jet
                                </span>
                            </div>
                            <p className="text-muted-foreground mb-6 leading-relaxed max-w-md">
                                The fastest way to test, debug, and document your APIs. Built for developers who demand speed and reliability.
                            </p>
                            <div className="flex gap-4">
                                {socialLinks.map((social, index) => (
                                    <motion.a
                                        key={social.label}
                                        href={social.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                                        whileHover={{ scale: 1.1, y: -2 }}
                                        whileTap={{ scale: 0.95 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
                                        viewport={{ once: true }}
                                    >
                                        <social.icon className="w-4 h-4" />
                                    </motion.a>
                                ))}
                            </div>
                        </motion.div>

                        {/* Links Columns */}
                        {Object.entries(footerLinks).map(([category, links], categoryIndex) => (
                            <motion.div
                                key={category}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 + categoryIndex * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <h3 className="font-semibold text-lg mb-4 capitalize text-foreground">
                                    {category}
                                </h3>
                                <ul className="space-y-3">
                                    {links.map((link, linkIndex) => (
                                        <motion.li
                                            key={link.name}
                                            initial={{ opacity: 0, x: -10 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.4, delay: 0.3 + linkIndex * 0.05 }}
                                            viewport={{ once: true }}
                                        >
                                            <button
                                                onClick={() => scrollToSection(link.href)}
                                                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-left w-full"
                                            >
                                                {link.name}
                                            </button>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Bottom Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4"
                    >
                        <p className="text-muted-foreground text-sm">
                            © 2024 Req Jet. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm text-muted-foreground">
                            <button onClick={() => router.push("/privacy")} className="hover:text-foreground transition-colors">
                                Privacy
                            </button>
                            <button onClick={() => router.push("/terms")} className="hover:text-foreground transition-colors">
                                Terms
                            </button>
                            <button onClick={() => router.push("/cookies")} className="hover:text-foreground transition-colors">
                                Cookies
                            </button>
                        </div>
                    </motion.div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
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