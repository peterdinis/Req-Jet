"use client";

import { FC, Suspense, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { DashboardSidebar } from "./DashboardSidebar";
import { useUser } from "@/hooks/auth/useUser";
import { RequestBuilder, SavedRequest } from "../requests/RequestBuilder";
import { Spinner } from "../ui/spinner";

/**
 * DashboardWrapper is the main container for the dashboard layout.
 * It provides the sidebar, header, and the request builder for API requests.
 *
 * @component
 * @example
 * <DashboardWrapper />
 */
const DashboardWrapper: FC = () => {
  /** Tracks the currently selected API request to display in the RequestBuilder */
  const [selectedRequest, setSelectedRequest] = useState<SavedRequest | null>(
    null,
  );

  /** The currently authenticated user from Supabase */
  const { user } = useUser();

  return (
    <Suspense fallback={<Spinner />}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          {/**
           * Sidebar displaying user's collections, folders, and requests.
           * Calls `setSelectedRequest` when a request is selected.
           */}
          <DashboardSidebar
            user={user}
            onRequestSelect={setSelectedRequest as any}
          />

          {/**
           * Main content area for the request builder.
           * Includes a sticky header with a sidebar toggle button.
           */}
          <main className="flex-1 overflow-auto">
            <div className="sticky top-0 z-10 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex h-14 items-center px-4">
                {/** Sidebar toggle button for responsive layouts */}
                <SidebarTrigger />
              </div>
            </div>

            {/**
             * RequestBuilder displays details of the selected API request.
             * Uses `selectedRequest` from sidebar selection.
             */}
            <RequestBuilder
              selectedRequest={selectedRequest as unknown as SavedRequest}
            />
          </main>
        </div>
      </SidebarProvider>
    </Suspense>
  );
};

export default DashboardWrapper;
