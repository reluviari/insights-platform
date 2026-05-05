import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  fetchBaseQuery,
} from "@reduxjs/toolkit/dist/query";
import { store } from "@src/store";
import { loginActions } from "@src/store/slices/login";
import { selectAuthToken } from "@src/store/slices/login/selectors";
import axios from "axios";
import qs from "qs";

axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_INSIGHTS_API}/api`;
axios.defaults.withCredentials = false;

axios.interceptors.request.use(
  (config: any) => {
    const token = selectAuthToken(store.getState());
    if (config.headers && token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    config.paramsSerializer = {
      serialize: (params: any) => qs.stringify(params, { arrayFormat: "indices" }),
    };
    return config;
  },
  error => error,
);

axios.interceptors.response.use(config => {
  if (config.status === 401) {
    if (config?.data?.message === "exception:UNAUTHORIZED") {
      store.dispatch(loginActions.controlView({ expireError: false, redirectToLogin: true }));
    }

    if (config?.data?.message === "exception:NEW_ACTIVE_TOKEN") {
      store.dispatch(loginActions.controlView({ expireError: true, redirectToLogin: false }));
    }
  }

  return config;
});

export const api = axios;

const baseQuery = fetchBaseQuery({
  baseUrl: `${process.env.NEXT_PUBLIC_INSIGHTS_API}/api`,
  prepareHeaders(headers, api) {
    const token = selectAuthToken(store.getState());
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryMiddleware: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  any,
  FetchBaseQueryMeta
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const error = result.error.data as any;
    if (error?.message === "exception:UNAUTHORIZED") {
      api.dispatch(loginActions.controlView({ expireError: false, redirectToLogin: true }));
    }

    if (error?.message === "exception:NEW_ACTIVE_TOKEN") {
      api.dispatch(loginActions.controlView({ expireError: true, redirectToLogin: false }));
    }

    api.dispatch(loginActions.controlData({ token: null }));
  }
  return result;
};

export const mergePaginationItems = (currentCache: any, newItems: any) => {
  const uniqueNewItems =
    newItems?.rows?.filter((newItem: any) => {
      return !currentCache?.rows?.some((cachedItem: any) => cachedItem.id === newItem.id);
    }) || [];

  return {
    ...newItems,
    rows: [...currentCache?.rows, ...uniqueNewItems],
  };
};

export const hasMoreItems = ({ page, pageSize, count }: any) => {
  return page * pageSize < count;
};
