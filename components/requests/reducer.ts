import { RequestState, KeyValue } from "@/types/RequestsTypes";

/**
 * Action types for the requestReducer
 */
type RequestAction =
  /** Sets a specific field of the request state */
  | { type: "SET_FIELD"; field: keyof RequestState; value: string }
  /** Replaces all headers in the request state */
  | { type: "SET_HEADERS"; value: KeyValue[] }
  /** Replaces all query parameters in the request state */
  | { type: "SET_QUERIES"; value: KeyValue[] };

/**
 * Reducer function to manage the state of an API request.
 *
 * Handles updating individual fields, headers, and query parameters.
 *
 * @param state - Current request state
 * @param action - Action to perform on the state
 * @returns Updated request state
 */
export function requestReducer(
  state: RequestState,
  action: RequestAction
): RequestState {
  switch (action.type) {
    /** Update a single field in the request state */
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    /** Replace headers array */
    case "SET_HEADERS":
      return { ...state, headers: action.value };
    /** Replace query parameters array */
    case "SET_QUERIES":
      return { ...state, queryParams: action.value };
    /** Return current state for unknown action */
    default:
      return state;
  }
}
