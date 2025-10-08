/**
 * Represents a response from an API request.
 */
export type ApiResponse = {
  /** The HTTP status code of the response. */
  status: number;
  /** The HTTP status text (optional). */
  statusText?: string;
  /** The response data, can be of any type (optional). */
  data?: unknown;
  /** The response headers as a key-value map (optional). */
  headers?: Record<string, string>;
  /** Error message, if the request failed (optional). */
  error?: string;
};

/**
 * Props for the ResponseViewer component.
 */
export type ResponseViewerProps = {
  /** The API response to display. */
  response: ApiResponse;
  /** The time taken for the request, in milliseconds. */
  responseTime: number;
};
