import { RequestState, KeyValue } from "@/types/RequestsTypes";


type RequestAction =
  | { type: "SET_FIELD"; field: keyof RequestState; value: string }
  | { type: "SET_HEADERS"; value: KeyValue[] }
  | { type: "SET_QUERIES"; value: KeyValue[] };
  
export function requestReducer(
  state: RequestState,
  action: RequestAction
): RequestState {
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
