"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Send, Plus, Trash2, Loader2, Save, Play } from "lucide-react";
import Editor from "@monaco-editor/react";
import { supabase } from "@/supabase/client";
import { SaveRequestDialog } from "./SaveRequestDialog";
import { ResponseViewer } from "../response/ResponseViewer";
import { useMonacoTheme } from "@/hooks/shared/useMonacoTheme";
import { AuthError } from "@supabase/supabase-js";

type Header = {
  key: string;
  value: string;
};

type QueryParam = {
  key: string;
  value: string;
  enabled: boolean;
};

type RequestBuilderProps = {
  selectedRequest?: any;
};

export function RequestBuilder({ selectedRequest }: RequestBuilderProps) {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const editorTheme = useMonacoTheme();
  const [headers, setHeaders] = useState<Header[]>([{ key: "", value: "" }]);
  const [queryParams, setQueryParams] = useState<QueryParam[]>([
    { key: "", value: "", enabled: true },
  ]);
  const [authType, setAuthType] = useState("none");
  const [authToken, setAuthToken] = useState("");
  const [body, setBody] = useState("");
  const [bodyType, setBodyType] = useState("json");
  const [requestType, setRequestType] = useState<"rest" | "graphql">("rest");
  const [graphqlQuery, setGraphqlQuery] = useState("");
  const [graphqlVariables, setGraphqlVariables] = useState("{}");
  const [testScript, setTestScript] = useState(
    "// Test script\n// Available: response, responseTime\n// Example:\n// if (response.status === 200) {\n//   console.log('Success!');\n// }",
  );
  const [testResults, setTestResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (selectedRequest) {
      setMethod(selectedRequest.method || "GET");
      setUrl(selectedRequest.url || "");
      setHeaders(selectedRequest.headers || [{ key: "", value: "" }]);
      setBody(selectedRequest.body || "");
      setRequestType(selectedRequest.request_type || "rest");
      setGraphqlQuery(selectedRequest.graphql_query || "");
      setGraphqlVariables(selectedRequest.graphql_variables || "{}");
      setTestScript(selectedRequest.test_script || "");
    }
  }, [selectedRequest]);

  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const removeHeader = (index: number) => {
    setHeaders(headers.filter((_, i) => i !== index));
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addQueryParam = () => {
    setQueryParams([...queryParams, { key: "", value: "", enabled: true }]);
  };

  const removeQueryParam = (index: number) => {
    setQueryParams(queryParams.filter((_, i) => i !== index));
  };

  const updateQueryParam = (
    index: number,
    field: keyof QueryParam,
    value: string | boolean,
  ) => {
    const newParams = [...queryParams];
    if (field === "enabled" && typeof value === "boolean") {
      newParams[index].enabled = value;
    } else if (
      (field === "key" || field === "value") &&
      typeof value === "string"
    ) {
      newParams[index][field] = value;
    }
    setQueryParams(newParams);
  };

  const buildUrl = () => {
    if (!url) return "";
    const enabledParams = queryParams.filter(
      (p) => p.enabled && p.key && p.value,
    );
    if (enabledParams.length === 0) return url;

    const params = new URLSearchParams();
    enabledParams.forEach((p) => params.append(p.key, p.value));
    return `${url}?${params.toString()}`;
  };

  const runTests = (responseData: { status: number; statusText: string; headers: { [k: string]: string; }; data: unknown; }, responseTime: number) => {
    try {
      const logs: string[] = [];
      const originalConsoleLog = console.log;

      // Override console.log to capture output
      console.log = (...args: unknown[]) => {
        logs.push(
          args
            .map((a) =>
              typeof a === "object" ? JSON.stringify(a, null, 2) : String(a),
            )
            .join(" "),
        );
      };

      // Execute the test script
      const testFunction = new Function(
        "response",
        "responseTime",
        "console",
        testScript,
      );
      testFunction(responseData, responseTime, console);

      // Restore original console.log
      console.log = originalConsoleLog;

      const result =
        logs.length > 0
          ? logs.join("\n")
          : "Tests completed successfully (no console output)";
      setTestResults(result);
      toast({ title: "Tests executed" });
    } catch (error) {
      const errorMsg =
        error && typeof error === "object" && "message" in error
          ? `Test error: ${(error as { message: string }).message}`
          : "Test error: Unknown error";
      setTestResults(errorMsg);
      toast({
        title: "Test execution failed",
        description:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error",
        variant: "destructive",
      });
    }
  };

  const sendRequest = async () => {
    const finalUrl = buildUrl();
    if (!finalUrl) {
      toast({ title: "Please enter a URL", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    setTestResults("");
    const startTime = Date.now();

    try {
      const requestHeaders: Record<string, string> = {};

      // Add custom headers
      headers.forEach((h) => {
        if (h.key && h.value) {
          requestHeaders[h.key] = h.value;
        }
      });

      // Add authorization header
      if (authType === "bearer" && authToken) {
        requestHeaders["Authorization"] = `Bearer ${authToken}`;
      } else if (authType === "basic" && authToken) {
        requestHeaders["Authorization"] = `Basic ${authToken}`;
      }

      const options: RequestInit = {
        method: requestType === "graphql" ? "POST" : method,
        headers: requestHeaders,
      };

      // Handle GraphQL or REST body
      if (requestType === "graphql") {
        requestHeaders["Content-Type"] = "application/json";
        options.body = JSON.stringify({
          query: graphqlQuery,
          variables: JSON.parse(graphqlVariables || "{}"),
        });
      } else if (["POST", "PUT", "PATCH"].includes(method) && body) {
        if (bodyType === "json") {
          requestHeaders["Content-Type"] = "application/json";
        } else if (bodyType === "xml") {
          requestHeaders["Content-Type"] = "application/xml";
        } else if (bodyType === "text") {
          requestHeaders["Content-Type"] = "text/plain";
        }
        options.body = body;
      }

      const res = await fetch(finalUrl, options);
      const endTime = Date.now();
      const reqTime = endTime - startTime;
      setResponseTime(reqTime);

      const contentType = res.headers.get("content-type");
      let data;

      if (contentType?.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      };

      setResponse(responseData);

      // Run tests if test script exists
      if (
        testScript &&
        testScript.trim() &&
        !testScript.includes("// Test script")
      ) {
        runTests(responseData, reqTime);
      }

      // Save to history
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("request_history").insert({
          user_id: user.id,
          url: finalUrl,
          method: requestType === "graphql" ? "GRAPHQL" : method,
          status_code: res.status,
          response_time: reqTime,
          response_body: typeof data === "string" ? data : JSON.stringify(data),
          response_headers: Object.fromEntries(res.headers.entries()),
        });
      }

      toast({ title: "Request sent successfully" });
    } catch (error) {
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      toast({
        title: "Request failed",
        description:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error",
        variant: "destructive",
      });
      setResponse({
        error:
          error && typeof error === "object" && "message" in error
            ? (error as { message: string }).message
            : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="border-b border-border p-4 space-y-3">
        <div className="flex gap-2 items-center">
          <Select
            value={requestType}
            onValueChange={(v) => setRequestType(v as "rest" | "graphql")}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rest">REST</SelectItem>
              <SelectItem value="graphql">GraphQL</SelectItem>
            </SelectContent>
          </Select>
          {requestType === "rest" && (
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
                <SelectItem value="HEAD">HEAD</SelectItem>
                <SelectItem value="OPTIONS">OPTIONS</SelectItem>
              </SelectContent>
            </Select>
          )}
          <Input
            placeholder="https://api.example.com/endpoint"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={sendRequest} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            Send
          </Button>
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setSaveDialogOpen(true)}
          >
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
        {queryParams.some((p) => p.enabled && p.key && p.value) &&
          requestType === "rest" && (
            <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">
              {buildUrl()}
            </div>
          )}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="grid lg:grid-cols-2 gap-4 p-4 h-full">
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Request</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-auto">
              <Tabs
                defaultValue={requestType === "graphql" ? "graphql" : "params"}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-6">
                  {requestType === "rest" && (
                    <TabsTrigger value="params">Params</TabsTrigger>
                  )}
                  {requestType === "graphql" && (
                    <TabsTrigger value="graphql">GraphQL</TabsTrigger>
                  )}
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  {requestType === "rest" && (
                    <TabsTrigger value="body">Body</TabsTrigger>
                  )}
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>

                {requestType === "graphql" && (
                  <TabsContent value="graphql" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Query</Label>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="250px"
                          defaultLanguage="graphql"
                          value={graphqlQuery}
                          onChange={(value) => setGraphqlQuery(value || "")}
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Variables</Label>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="150px"
                          defaultLanguage="json"
                          value={graphqlVariables}
                          onChange={(value) =>
                            setGraphqlVariables(value || "{}")
                          }
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                          }}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                {requestType === "rest" && (
                  <TabsContent value="params" className="space-y-4">
                    <div className="space-y-2">
                      {queryParams.map((param, index) => (
                        <div key={index} className="flex gap-2 items-center">
                          <input
                            type="checkbox"
                            checked={param.enabled}
                            onChange={(e) =>
                              updateQueryParam(
                                index,
                                "enabled",
                                e.target.checked,
                              )
                            }
                            className="w-4 h-4"
                          />
                          <Input
                            placeholder="Key"
                            value={param.key}
                            onChange={(e) =>
                              updateQueryParam(index, "key", e.target.value)
                            }
                            className="flex-1"
                          />
                          <Input
                            placeholder="Value"
                            value={param.value}
                            onChange={(e) =>
                              updateQueryParam(index, "value", e.target.value)
                            }
                            className="flex-1"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeQueryParam(index)}
                            disabled={queryParams.length === 1}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={addQueryParam}
                      className="w-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Parameter
                    </Button>
                  </TabsContent>
                )}

                <TabsContent value="auth" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="p-2">Auth Type</Label>
                      <Select value={authType} onValueChange={setAuthType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No Auth</SelectItem>
                          <SelectItem value="bearer">Bearer Token</SelectItem>
                          <SelectItem value="basic">Basic Auth</SelectItem>
                          <SelectItem value="apikey">API Key</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {authType !== "none" && (
                      <div className="space-y-2">
                        <Label>Token</Label>
                        <Input
                          type="password"
                          placeholder="Enter your token"
                          value={authToken}
                          onChange={(e) => setAuthToken(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="headers" className="space-y-4">
                  {headers.map((header, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <Input
                        placeholder="Key"
                        value={header.key}
                        onChange={(e) =>
                          updateHeader(index, "key", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Input
                        placeholder="Value"
                        value={header.value}
                        onChange={(e) =>
                          updateHeader(index, "value", e.target.value)
                        }
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeHeader(index)}
                        disabled={headers.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addHeader}
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Header
                  </Button>
                </TabsContent>

                {requestType === "rest" && (
                  <TabsContent value="body" className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex gap-2 items-center">
                        <Label>Body Type</Label>
                        <Select value={bodyType} onValueChange={setBodyType}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="json">JSON</SelectItem>
                            <SelectItem value="xml">XML</SelectItem>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="form">Form Data</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="border border-border rounded-lg overflow-hidden">
                        <Editor
                          height="300px"
                          defaultLanguage={
                            bodyType === "json"
                              ? "json"
                              : bodyType === "xml"
                                ? "xml"
                                : "plaintext"
                          }
                          value={body}
                          onChange={(value) => setBody(value || "")}
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            lineNumbers: "on",
                            roundedSelection: false,
                            scrollBeyondLastLine: false,
                            automaticLayout: true,
                          }}
                        />
                      </div>
                    </div>
                  </TabsContent>
                )}

                <TabsContent value="tests" className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Test Script</Label>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          response && runTests(response, responseTime)
                        }
                        disabled={!response}
                        className="gap-2"
                      >
                        <Play className="h-3 w-3" />
                        Run Tests
                      </Button>
                    </div>
                    <div className="border border-border rounded-lg overflow-hidden">
                      <Editor
                        height="300px"
                        defaultLanguage="javascript"
                        value={testScript}
                        onChange={(value) => setTestScript(value || "")}
                        theme={editorTheme}
                        options={{
                          minimap: { enabled: false },
                          fontSize: 13,
                        }}
                      />
                    </div>
                    {testResults && (
                      <div className="mt-4">
                        <Label>Test Results</Label>
                        <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-auto max-h-40">
                          {testResults}
                        </pre>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex flex-col">
            {response ? (
              <ResponseViewer response={response} responseTime={responseTime} />
            ) : (
              <Card className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Send className="h-12 w-12 mx-auto mb-4 opacity-20" />
                  <p>Send a request to see the response</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      <SaveRequestDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        requestData={{ name: "", url, method, headers, body }}
      />
    </div>
  );
}
