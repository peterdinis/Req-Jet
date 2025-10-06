import { RequestState } from "@/types/RequestsTypes";

// --- REDUCER ---
export function requestReducer(state: RequestState, action: any): RequestState {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_HEADERS":
      return { ...state, headers: action.value };
    case "SET_QUERIES":
      return { ...state, queryParams: action.value };
    default:
      return state;
  }
}