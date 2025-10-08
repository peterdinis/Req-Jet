/**
 * Represents a key-value pair used in HTTP headers.
 */
export type Header = {
  /** The header name. */
  key: string;
  /** The header value. */
  value: string;
};

/**
 * Props for the SaveRequestDialog component.
 */
export type SaveRequestDialogProps = {
  /** Whether the dialog is open. */
  open: boolean;
  /** Callback triggered when the dialog open state changes. */
  onOpenChange: (open: boolean) => void;
  /** The data for the request being saved. */
  requestData: {
    /** The name of the request. */
    name: string;
    /** The URL of the request. */
    url: string;
    /** The HTTP method (e.g., GET, POST). */
    method: string;
    /** The HTTP headers for the request. */
    headers: Header[];
    /** The request body as a string. */
    body: string;
  };
};
