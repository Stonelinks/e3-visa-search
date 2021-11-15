export enum ApiRequestState {
  none = "none",
  loading = "loading",
  done = "done",
}

export interface ApiRequest {
  url: string;
  state: ApiRequestState;
  value: any;
}

export interface ApiStoreState {
  getConfig: ApiRequest;
  setConfigValue: ApiRequest;
  e3search: ApiRequest;
}

export type ApiResource = keyof ApiStoreState;
