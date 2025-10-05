"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, FileText } from "lucide-react";
import Editor from "@monaco-editor/react";

type ResponseViewerProps = {
  response: any;
  responseTime: number;
};

const formatBytes = (bytes: number) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

export function ResponseViewer({
  response,
  responseTime,
}: ResponseViewerProps) {
  const isSuccess = response.status >= 200 && response.status < 300;
  const isError = response.status >= 400 || response.error;

  const responseBody = response.error
    ? response.error
    : typeof response.data === "string"
      ? response.data
      : JSON.stringify(response.data, null, 2);

  const bodySize = new Blob([responseBody]).size;

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
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{responseTime}ms</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <FileText className="h-4 w-4" />
              <span>{formatBytes(bodySize)}</span>
            </div>
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
            <div className="border border-border rounded-lg overflow-hidden h-full">
              <Editor
                height="100%"
                defaultLanguage={response.error ? "plaintext" : "json"}
                value={responseBody}
                theme="vs-dark"
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
            </div>
          </TabsContent>

          <TabsContent value="headers" className="mt-4">
            {response.headers && (
              <div className="rounded-lg bg-muted p-4 overflow-auto max-h-96 space-y-2">
                {Object.entries(response.headers).map(([key, value]) => (
                  <div key={key} className="flex gap-2 text-sm">
                    <span className="font-semibold text-primary min-w-[200px]">
                      {key}:
                    </span>
                    <span className="text-muted-foreground break-all">
                      {value as string}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="cookies" className="mt-4">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                No cookies in this response
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
