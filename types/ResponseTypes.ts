export type ApiResponse = {
  status: number;
  statusText?: string;
  data?: unknown;
  headers?: Record<string, string>;
  error?: string;
};

export type ResponseViewerProps = {
  response: ApiResponse;
  responseTime: number;
};
