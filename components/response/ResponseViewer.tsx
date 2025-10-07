"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, FileText, LucideIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { useMonacoTheme } from "@/hooks/shared/useMonacoTheme";
import { useMemo } from "react";
import prettyBytes from "pretty-bytes";
import { ResponseViewerProps } from "@/types/ResponseTypes";

const InfoBadge = ({ icon: Icon, label }: { icon: LucideIcon; label: string }) => (
  <div className="flex items-center gap-1 text-sm text-muted-foreground">
    <Icon className="h-4 w-4" />
    <span>{label}</span>
  </div>
);

export function ResponseViewer({
  response,
  responseTime,
}: ResponseViewerProps) {
  const editorTheme = useMonacoTheme();

  const { responseBody, bodySize, isSuccess, isError } = useMemo(() => {
    const body = response.error
      ? response.error
      : typeof response.data === "string"
        ? response.data
        : JSON.stringify(response.data, null, 2);

    return {
      responseBody: body,
      bodySize: new Blob([body]).size,
      isSuccess: response.status >= 200 && response.status < 300,
      isError: response.status >= 400 || Boolean(response.error),
    };
  }, [response]);

  return (
    <Card className="animate-fade-in flex flex-col flex-1">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Response
            {isSuccess && <CheckCircle2 className="h-5 w-5 text-green-500" />}
            {isError && <XCircle className="h-5 w-5 text-red-500" />}
          </CardTitle>
          <div className="flex items-center gap-4">
            {response.status && (
              <Badge
                variant={isSuccess ? "default" : "destructive"}
                className="font-mono"
              >
                {response.status} {response.statusText}
              </Badge>
            )}
            <InfoBadge icon={Clock} label={`${responseTime}ms`} />
            <InfoBadge icon={FileText} label={prettyBytes(bodySize)} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden">
        <Tabs defaultValue="body" className="w-full h-full flex flex-col">
          <TabsList>
            <TabsTrigger value="body">Body</TabsTrigger>
            <TabsTrigger value="headers">
              Headers (
              {response.headers ? Object.keys(response.headers).length : 0})
            </TabsTrigger>
            <TabsTrigger value="cookies">Cookies</TabsTrigger>
          </TabsList>

          <TabsContent value="body" className="mt-4 flex-1 overflow-hidden">
            <Editor
              height="100%"
              defaultLanguage={response.error ? "plaintext" : "json"}
              value={responseBody}
              theme={editorTheme}
              options={{
                readOnly: true,
                minimap: { enabled: false },
                fontSize: 13,
                lineNumbers: "on",
                scrollBeyondLastLine: false,
                automaticLayout: true,
                wordWrap: "on",
              }}
            />
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            {response.headers ? (
              <div className="rounded-lg bg-muted p-4 overflow-auto max-h-96 space-y-2">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="font-semibold text-primary min-w-[200px]">
                      {key}:
                    </span>
                    <span className="text-muted-foreground break-all">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No headers</p>
            )}
          </TabsContent>

          <TabsContent value="cookies" className="mt-4">
            <p className="text-sm text-muted-foreground">
              No cookies in this response
            </p>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
