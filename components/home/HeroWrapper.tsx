"use client"

import { FC } from "react";
import { Button } from "@/components/ui/button";
import { Zap, Send, FolderTree, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { ModeToggle } from "../shared/ModeToggle";

const HeroWrapper: FC = () => {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                            <Zap className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <span className="font-bold text-xl">API Tester</span>
                    </div>
                    <Button onClick={() => router.push("/auth")}>Get Started</Button>
                    <ModeToggle />
                </div>
            </nav>

            <main className="container mx-auto px-4 py-20">
                <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Test APIs with Confidence
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                            A powerful API testing platform that helps you build, test, and document your APIs faster than ever before.
                        </p>
                    </div>

                    <div className="flex gap-4 justify-center">
                        <Button size="lg" onClick={() => router.push("/auth")} className="gap-2">
                            <Zap className="h-5 w-5" />
                            Start Testing
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => router.push("/auth")}>
                            Learn More
                        </Button>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 mt-16">
                        <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur space-y-3 hover:border-primary transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Send className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Send Requests</h3>
                            <p className="text-muted-foreground">
                                Test any API endpoint with support for all HTTP methods and custom headers.
                            </p>
                        </div>

                        <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur space-y-3 hover:border-primary transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                                <FolderTree className="h-6 w-6 text-accent" />
                            </div>
                            <h3 className="text-xl font-semibold">Organize Collections</h3>
                            <p className="text-muted-foreground">
                                Keep your API requests organized in collections and folders for easy access.
                            </p>
                        </div>

                        <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur space-y-3 hover:border-primary transition-colors">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold">Track History</h3>
                            <p className="text-muted-foreground">
                                View response times and keep track of all your API request history.
                            </p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default HeroWrapper