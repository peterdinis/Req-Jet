"use client";

import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/supabase/client";

export function HistoryViewer() {
  const { data: history, isLoading } = useQuery({
    queryKey: ["request_history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("request_history")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
  });

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300)
      return "bg-green-500/20 text-green-400 border-green-500/30";
    if (status >= 400 && status < 500)
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    if (status >= 500) return "bg-red-500/20 text-red-400 border-red-500/30";
    return "bg-muted text-muted-foreground";
  };

  const getMethodColor = (method: string) => {
    const colors: Record<string, string> = {
      GET: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      POST: "bg-green-500/20 text-green-400 border-green-500/30",
      PUT: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      PATCH: "bg-purple-500/20 text-purple-400 border-purple-500/30",
      DELETE: "bg-red-500/20 text-red-400 border-red-500/30",
    };
    return colors[method] || "bg-muted text-muted-foreground";
  };

  if (isLoading) {
    return (
      <Card className="flex-1">
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading history...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Request History
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <ScrollArea className="h-[600px]">
          <div className="space-y-3">
            {history?.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                No history yet
              </p>
            ) : (
              history?.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Badge
                        className={getMethodColor(entry.method)}
                        variant="outline"
                      >
                        {entry.method}
                      </Badge>
                      <Badge
                        className={getStatusColor(entry.status_code || 0)}
                        variant="outline"
                      >
                        {entry.status_code || "ERR"}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm truncate font-mono">
                        {entry.url}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground whitespace-nowrap">
                      {entry.response_time ? `${entry.response_time}ms` : "-"}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {format(
                      new Date(entry.created_at as unknown as string),
                      "MMM dd, yyyy HH:mm:ss",
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
