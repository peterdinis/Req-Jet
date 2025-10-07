"use client";

import { useState, useEffect, useReducer, useCallback, useMemo } from "react";
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
import { SaveRequestDialog } from "./SaveRequestDialog";
import { ResponseViewer } from "../response/ResponseViewer";
import { useMonacoTheme } from "@/hooks/shared/useMonacoTheme";
import { KeyValue } from "@/types/RequestsTypes";
import { requestReducer } from "./reducer";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { useMediaQuery } from "@/hooks/shared/useMediaQuery";

function KeyValueList({
  items,
  onChange,
  onRemove,
  allowAdd = true,
  addLabel = "Add",
}: {
  items: KeyValue[];
  onChange: (index: number, key: keyof KeyValue | "add", value: any) => void;
  onRemove: (index: number) => void;
  allowAdd?: boolean;
  addLabel?: string;
}) {
  return (
    <div className="space-y-2">
      {items.map((item, index) => (
        <div key={index} className="flex gap-2 items-center">
          {"enabled" in item && (
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(e) => onChange(index, "enabled", e.target.checked)}
              className="w-4 h-4"
            />
          )}
          <Input
            placeholder="Key"
            value={item.key}
            onChange={(e) => onChange(index, "key", e.target.value)}
            className="flex-1"
          />
          <Input
            placeholder="Value"
            value={item.value}
            onChange={(e) => onChange(index, "value", e.target.value)}
            className="flex-1"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onRemove(index)}
            disabled={items.length === 1}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      {allowAdd && (
        <Button
          variant="outline"
          onClick={() =>
            onChange(items.length, "add", { key: "", value: "", enabled: true })
          }
          className="w-full gap-2"
        >
          <Plus className="h-4 w-4" />
          {addLabel}
        </Button>
      )}
    </div>
  );
}

export function RequestBuilder({ selectedRequest }: { selectedRequest?: any }) {
  const editorTheme = useMonacoTheme();
  const { toast } = useToast();
  const [state, dispatch] = useReducer(requestReducer, {
    method: "GET",
    url: "",
    headers: [{ key: "", value: "" }],
    queryParams: [{ key: "", value: "", enabled: true }],
    authType: "none",
    authToken: "",
    body: "",
    bodyType: "json",
    requestType: "rest",
    graphqlQuery: "",
    graphqlVariables: "{}",
    testScript:
      "// Test script\n// Available: response, responseTime\n// Example:\n// if (response.status === 200) {\n//   console.log('Success!');\n// }",
  });
  const [response, setResponse] = useState<any>(null);
  const [responseTime, setResponseTime] = useState<number>(0);
  const [testResults, setTestResults] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    if (selectedRequest) {
      dispatch({
        type: "SET_FIELD",
        field: "method",
        value: selectedRequest.method || "GET",
      });
      dispatch({
        type: "SET_FIELD",
        field: "url",
        value: selectedRequest.url || "",
      });
      dispatch({
        type: "SET_HEADERS",
        value: selectedRequest.headers || [{ key: "", value: "" }],
      });
      dispatch({
        type: "SET_FIELD",
        field: "body",
        value: selectedRequest.body || "",
      });
      dispatch({
        type: "SET_FIELD",
        field: "requestType",
        value: selectedRequest.request_type || "rest",
      });
      dispatch({
        type: "SET_FIELD",
        field: "graphqlQuery",
        value: selectedRequest.graphql_query || "",
      });
      dispatch({
        type: "SET_FIELD",
        field: "graphqlVariables",
        value: selectedRequest.graphql_variables || "{}",
      });
      dispatch({
        type: "SET_FIELD",
        field: "testScript",
        value: selectedRequest.test_script || "",
      });
    }
  }, [selectedRequest]);

  const buildUrl = useMemo(() => {
    if (!state.url) return "";
    const params = new URLSearchParams();
    state.queryParams
      .filter((p) => p.enabled && p.key && p.value)
      .forEach((p) => params.append(p.key, p.value));
    return params.toString() ? `${state.url}?${params.toString()}` : state.url;
  }, [state.url, state.queryParams]);

  const handleKeyValueChange =
    (type: "headers" | "queryParams") =>
    (index: number, field: keyof KeyValue | "add", value: any) => {
      if (field === "add") {
        const newItems = [...state[type], value];
        dispatch({
          type: type === "headers" ? "SET_HEADERS" : "SET_QUERIES",
          value: newItems,
        });
        return;
      }
      const newItems = state[type].map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      );
      dispatch({
        type: type === "headers" ? "SET_HEADERS" : "SET_QUERIES",
        value: newItems,
      });
    };

  const handleRemoveKeyValue =
    (type: "headers" | "queryParams") => (index: number) => {
      const newItems = state[type].filter((_, i) => i !== index);
      dispatch({
        type: type === "headers" ? "SET_HEADERS" : "SET_QUERIES",
        value: newItems,
      });
    };

  const sendRequest = useCallback(async () => {
    if (!state.url)
      return toast({ title: "Please enter a URL", variant: "destructive" });
    setIsLoading(true);
    setTestResults("");
    setResponse(null);
    const startTime = Date.now();

    try {
      const headers: Record<string, string> = {};
      state.headers.forEach(
        (h) => h.key && h.value && (headers[h.key] = h.value),
      );
      if (state.authType === "bearer" && state.authToken)
        headers["Authorization"] = `Bearer ${state.authToken}`;
      if (state.authType === "basic" && state.authToken)
        headers["Authorization"] = `Basic ${state.authToken}`;

      const options: RequestInit = {
        method: state.requestType === "graphql" ? "POST" : state.method,
        headers,
      };
      if (state.requestType === "graphql") {
        headers["Content-Type"] = "application/json";
        options.body = JSON.stringify({
          query: state.graphqlQuery,
          variables: JSON.parse(state.graphqlVariables || "{}"),
        });
      } else if (
        ["POST", "PUT", "PATCH"].includes(state.method) &&
        state.body
      ) {
        if (state.bodyType === "json")
          headers["Content-Type"] = "application/json";
        options.body = state.body;
      }

      const res = await fetch(buildUrl, options);
      const endTime = Date.now();
      setResponseTime(endTime - startTime);
      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("json")
        ? await res.json()
        : await res.text();
      const responseData = {
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers.entries()),
        data,
      };
      setResponse(responseData);

      if (state.testScript?.trim()) {
        try {
          const logs: string[] = [];
          const customConsole = {
            log: (...args: any[]) => logs.push(args.join(" ")),
          };
          new Function("response", "responseTime", "console", state.testScript)(
            responseData,
            endTime - startTime,
            customConsole,
          );
          setTestResults(
            logs.join("\n") ||
              "✅ Test executed successfully (no console output)",
          );
        } catch (e: any) {
          setTestResults(`❌ Test error: ${e.message || e}`);
        }
      }

      toast({ title: "Request sent successfully" });
    } catch (e: any) {
      setResponse({ error: e.message || "Unknown error" });
      toast({
        title: "Request failed",
        description: e.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [state, buildUrl, toast]);

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Top Bar */}
      <div className="border-b border-border p-4 flex flex-col md:flex-row gap-2 items-stretch md:items-center">
        <div className="flex gap-2 w-full md:w-auto">
          <Select
            value={state.requestType}
            onValueChange={(v) =>
              dispatch({ type: "SET_FIELD", field: "requestType", value: v })
            }
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rest">REST</SelectItem>
              <SelectItem value="graphql">GraphQL</SelectItem>
            </SelectContent>
          </Select>
          {state.requestType === "rest" && (
            <Select
              value={state.method}
              onValueChange={(v) =>
                dispatch({ type: "SET_FIELD", field: "method", value: v })
              }
            >
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "GET",
                  "POST",
                  "PUT",
                  "PATCH",
                  "DELETE",
                  "HEAD",
                  "OPTIONS",
                ].map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        <Input
          placeholder="https://api.example.com"
          value={state.url}
          onChange={(e) =>
            dispatch({ type: "SET_FIELD", field: "url", value: e.target.value })
          }
          className="flex-1"
        />

        <div className="flex gap-2 justify-end w-full md:w-auto">
          <Button onClick={sendRequest} disabled={isLoading} className="gap-2">
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}{" "}
            Send
          </Button>
          <Button
            variant="outline"
            onClick={() => setSaveDialogOpen(true)}
            className="gap-2"
          >
            <Save className="h-4 w-4" /> Save
          </Button>
        </div>
      </div>

      {/* URL Preview */}
      {state.queryParams.some((p) => p.enabled && p.key && p.value) &&
        state.requestType === "rest" && (
          <div className="text-sm text-muted-foreground font-mono bg-muted px-3 py-2 rounded">
            {buildUrl}
          </div>
        )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-2 md:p-4 grid grid-cols-1 lg:grid-cols-2 gap-4 h-full">
        {/* Response first on mobile */}
        <div className="flex flex-col order-1 lg:order-2">
          {response ? (
            <ResponseViewer response={response} responseTime={responseTime} />
          ) : (
            <Card className="flex-1 flex items-center justify-center text-muted-foreground">
              <Send className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p>Send a request to see the response</p>
            </Card>
          )}
        </div>

        {/* Request Card */}
        <Card className="flex flex-col order-2 lg:order-1">
          <CardHeader>
            <CardTitle>Request</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {isMobile ? (
              <>
                {" "}
                <Accordion
                  type="single"
                  collapsible
                  className="w-full space-y-2"
                >
                  {state.requestType === "rest" && (
                    <AccordionItem value="params">
                      <AccordionTrigger>Params</AccordionTrigger>
                      <AccordionContent>
                        <KeyValueList
                          items={state.queryParams}
                          onChange={handleKeyValueChange("queryParams")}
                          onRemove={handleRemoveKeyValue("queryParams")}
                          addLabel="Add Parameter"
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  {state.requestType === "graphql" && (
                    <AccordionItem value="graphql">
                      <AccordionTrigger>GraphQL</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <Label>Query</Label>
                          <Editor
                            height="200px"
                            defaultLanguage="graphql"
                            value={state.graphqlQuery}
                            onChange={(v) =>
                              dispatch({
                                type: "SET_FIELD",
                                field: "graphqlQuery",
                                value: v || "",
                              })
                            }
                            theme={editorTheme}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                            }}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Variables</Label>
                          <Editor
                            height="150px"
                            defaultLanguage="json"
                            value={state.graphqlVariables}
                            onChange={(v) =>
                              dispatch({
                                type: "SET_FIELD",
                                field: "graphqlVariables",
                                value: v || "{}",
                              })
                            }
                            theme={editorTheme}
                            options={{
                              minimap: { enabled: false },
                              fontSize: 13,
                            }}
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="auth">
                    <AccordionTrigger>Auth</AccordionTrigger>
                    <AccordionContent>
                      <Label>Auth Type</Label>
                      <Select
                        value={state.authType}
                        onValueChange={(v) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "authType",
                            value: v,
                          })
                        }
                      >
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
                      {state.authType !== "none" && (
                        <Input
                          type="password"
                          placeholder="Enter token"
                          value={state.authToken}
                          onChange={(e) =>
                            dispatch({
                              type: "SET_FIELD",
                              field: "authToken",
                              value: e.target.value,
                            })
                          }
                        />
                      )}
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="headers">
                    <AccordionTrigger>Headers</AccordionTrigger>
                    <AccordionContent>
                      <KeyValueList
                        items={state.headers}
                        onChange={handleKeyValueChange("headers")}
                        onRemove={handleRemoveKeyValue("headers")}
                        addLabel="Add Header"
                      />
                    </AccordionContent>
                  </AccordionItem>
                  {state.requestType === "rest" && (
                    <AccordionItem value="body">
                      <AccordionTrigger>Body</AccordionTrigger>
                      <AccordionContent>
                        <Label>Body Type</Label>
                        <Select
                          value={state.bodyType}
                          onValueChange={(v) =>
                            dispatch({
                              type: "SET_FIELD",
                              field: "bodyType",
                              value: v,
                            })
                          }
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(["json", "xml", "text", "form"] as const).map(
                              (t) => (
                                <SelectItem key={t} value={t}>
                                  {t.toUpperCase()}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
                        <Editor
                          height="200px"
                          defaultLanguage={
                            state.bodyType === "json"
                              ? "json"
                              : state.bodyType === "xml"
                                ? "xml"
                                : "plaintext"
                          }
                          value={state.body}
                          onChange={(v) =>
                            dispatch({
                              type: "SET_FIELD",
                              field: "body",
                              value: v || "",
                            })
                          }
                          theme={editorTheme}
                          options={{
                            minimap: { enabled: false },
                            fontSize: 13,
                            automaticLayout: true,
                          }}
                        />
                      </AccordionContent>
                    </AccordionItem>
                  )}
                  <AccordionItem value="tests">
                    <AccordionTrigger>Tests</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex justify-between items-center">
                        <Label>Test Script</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={() => response && sendRequest()}
                        >
                          <Play className="h-3 w-3" /> Run Tests
                        </Button>
                      </div>
                      <Editor
                        height="200px"
                        defaultLanguage="javascript"
                        value={state.testScript}
                        onChange={(v) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "testScript",
                            value: v || "",
                          })
                        }
                        theme={editorTheme}
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                      />
                      {testResults && (
                        <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-auto max-h-40">
                          {testResults}
                        </pre>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <Tabs
                defaultValue={
                  state.requestType === "graphql" ? "graphql" : "params"
                }
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
                  {state.requestType === "rest" && (
                    <TabsTrigger value="params">Params</TabsTrigger>
                  )}
                  {state.requestType === "graphql" && (
                    <TabsTrigger value="graphql">GraphQL</TabsTrigger>
                  )}
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  {state.requestType === "rest" && (
                    <TabsTrigger value="body">Body</TabsTrigger>
                  )}
                  <TabsTrigger value="tests">Tests</TabsTrigger>
                </TabsList>

                {/* Params */}
                {state.requestType === "rest" && (
                  <TabsContent value="params">
                    <KeyValueList
                      items={state.queryParams}
                      onChange={handleKeyValueChange("queryParams")}
                      onRemove={handleRemoveKeyValue("queryParams")}
                      addLabel="Add Parameter"
                    />
                  </TabsContent>
                )}

                {/* GraphQL */}
                {state.requestType === "graphql" && (
                  <TabsContent value="graphql" className="space-y-4">
                    <div className="space-y-2">
                      <Label>Query</Label>
                      <Editor
                        height="200px"
                        className="md:h-[250px]"
                        defaultLanguage="graphql"
                        value={state.graphqlQuery}
                        onChange={(v) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "graphqlQuery",
                            value: v || "",
                          })
                        }
                        theme={editorTheme}
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Variables</Label>
                      <Editor
                        height="150px"
                        className="md:h-[200px]"
                        defaultLanguage="json"
                        value={state.graphqlVariables}
                        onChange={(v) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "graphqlVariables",
                            value: v || "{}",
                          })
                        }
                        theme={editorTheme}
                        options={{ minimap: { enabled: false }, fontSize: 13 }}
                      />
                    </div>
                  </TabsContent>
                )}

                {/* Auth */}
                <TabsContent value="auth" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Auth Type</Label>
                    <Select
                      value={state.authType}
                      onValueChange={(v) =>
                        dispatch({
                          type: "SET_FIELD",
                          field: "authType",
                          value: v,
                        })
                      }
                    >
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
                    {state.authType !== "none" && (
                      <Input
                        type="password"
                        placeholder="Enter token"
                        value={state.authToken}
                        onChange={(e) =>
                          dispatch({
                            type: "SET_FIELD",
                            field: "authToken",
                            value: e.target.value,
                          })
                        }
                      />
                    )}
                  </div>
                </TabsContent>

                {/* Headers */}
                <TabsContent value="headers">
                  <KeyValueList
                    items={state.headers}
                    onChange={handleKeyValueChange("headers")}
                    onRemove={handleRemoveKeyValue("headers")}
                    addLabel="Add Header"
                  />
                </TabsContent>

                {/* Body */}
                {state.requestType === "rest" && (
                  <TabsContent value="body" className="space-y-2">
                    <Label>Body Type</Label>
                    <Select
                      value={state.bodyType}
                      onValueChange={(v) =>
                        dispatch({
                          type: "SET_FIELD",
                          field: "bodyType",
                          value: v,
                        })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {["json", "xml", "text", "form"].map((t) => (
                          <SelectItem key={t} value={t}>
                            {t.toUpperCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Editor
                      height="200px"
                      className="md:h-[300px]"
                      defaultLanguage={
                        state.bodyType === "json"
                          ? "json"
                          : state.bodyType === "xml"
                            ? "xml"
                            : "plaintext"
                      }
                      value={state.body}
                      onChange={(v) =>
                        dispatch({
                          type: "SET_FIELD",
                          field: "body",
                          value: v || "",
                        })
                      }
                      theme={editorTheme}
                      options={{
                        minimap: { enabled: false },
                        fontSize: 13,
                        automaticLayout: true,
                      }}
                    />
                  </TabsContent>
                )}

                {/* Tests */}
                <TabsContent value="tests" className="space-y-2">
                  <div className="flex justify-between items-center">
                    <Label>Test Script</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => response && sendRequest()}
                    >
                      <Play className="h-3 w-3" /> Run Tests
                    </Button>
                  </div>
                  <Editor
                    height="200px"
                    className="md:h-[300px]"
                    defaultLanguage="javascript"
                    value={state.testScript}
                    onChange={(v) =>
                      dispatch({
                        type: "SET_FIELD",
                        field: "testScript",
                        value: v || "",
                      })
                    }
                    theme={editorTheme}
                    options={{ minimap: { enabled: false }, fontSize: 13 }}
                  />
                  {testResults && (
                    <pre className="mt-2 p-3 bg-muted rounded-lg text-sm overflow-auto max-h-40">
                      {testResults}
                    </pre>
                  )}
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>

      <SaveRequestDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        requestData={{
          name: "",
          url: state.url,
          method: state.method,
          headers: state.headers,
          body: state.body,
        }}
      />
    </div>
  );
}
