import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryMiddleware } from "./api";

export const departmentsApi = createApi({
  reducerPath: "departmentsApi",
  baseQuery: baseQueryMiddleware,
  endpoints: builder => ({
    getDepartments: builder.query({
      query: ({ params, customerId }) => ({
        url: `/customers/${customerId}/departments`,
        method: "GET",
        params,
      }),
    }),
  }),
});

export const { useGetDepartmentsQuery } = departmentsApi;
