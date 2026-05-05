import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryMiddleware } from "./api";

export const settingsApi = createApi({
  reducerPath: "settingsApi",
  baseQuery: baseQueryMiddleware,
  endpoints: builder => ({
    getSettings: builder.query({
      query: () => ({
        url: "/settings",
        method: "GET",
      }),
    }),
  }),
});

export const { useGetSettingsQuery } = settingsApi;
