"use client"

import { FC, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useUser } from "@/hooks/auth/useUser";
import { RequestBuilder } from "../requests/RequestBuilder";

const DashboardWrapper: FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const {user} = useUser();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar user={user} onRequestSelect={setSelectedRequest} />
        <main className="flex-1 overflow-auto">
          <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center px-4">
              <SidebarTrigger />
            </div>
          </div>
         <RequestBuilder selectedRequest={selectedRequest} />
        </main>
      </div>
    </SidebarProvider>
  );
};

export default DashboardWrapper;
