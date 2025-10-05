import { FC } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";

const DashboardWrapper: FC = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-background">
                SIDEBAR
                <main className="flex-1 overflow-auto">
                    <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                        <div className="flex h-14 items-center px-4">
                            <SidebarTrigger />
                        </div>
                    </div>
                    MAIN CONTENT
                </main>
            </div>
        </SidebarProvider>
    )
}

export default DashboardWrapper