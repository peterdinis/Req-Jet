/**
 * Represents a key-value pair, optionally enabled or disabled.
 */
export type KeyValue = {
  /** The key name. */
  key: string;
  /** The value associated with the key. */
  value: string;
  /** Whether this key-value pair is enabled. Defaults to `true`. */
  enabled?: boolean;
};

/**
 * Represents the state of an HTTP or GraphQL request.
 */
export type RequestState = {
  /** The HTTP method (e.g., GET, POST). */
  method: string;
  /** The request URL. */
  url: string;
  /** Array of HTTP headers. */
  headers: KeyValue[];
  /** Array of query parameters. */
  queryParams: KeyValue[];
  /** The type of authentication used (e.g., Bearer, Basic). */
  authType: string;
  /** The authentication token. */
  authToken: string;
  /** The request body as a string. */
  body: string;
  /** The type of the body (e.g., JSON, form-data). */
  bodyType: string;
  /** The type of request, either REST or GraphQL. */
  requestType: "rest" | "graphql";
  /** The GraphQL query string (used only if `requestType` is "graphql"). */
  graphqlQuery: string;
  /** The GraphQL variables as a string (used only if `requestType` is "graphql"). */
  graphqlVariables: string;
  /** The test script associated with the request. */
  testScript: string;
};
