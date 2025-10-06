export type KeyValue = { key: string; value: string; enabled?: boolean };

export type RequestState = {
  method: string;
  url: string;
  headers: KeyValue[];
  queryParams: KeyValue[];
  authType: string;
  authToken: string;
  body: string;
  bodyType: string;
  requestType: "rest" | "graphql";
  graphqlQuery: string;
  graphqlVariables: string;
  testScript: string;
};