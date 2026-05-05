import { createApi } from "@reduxjs/toolkit/query/react";
import { EditAssociateReport } from "@src/shared/interfaces/edit-associate-report.interface";
import { Pagination } from "@src/shared/interfaces/pagination";
import { UpdateStatusCustomer } from "@src/shared/interfaces/update-status-customer.interface";
import { AppDispatch, store } from "@src/store";
import { customerActions } from "@src/store/slices/customers";
import { reportActions } from "@src/store/slices/reports";
import { string } from "yup";

import { api, baseQueryMiddleware } from "./api";

interface Customer {
  name?: string;
  phone?: string;
  document?: string;
  clientId?: string;
  logo?: string;
  tenant?: string;
  isActive?: boolean;
}
interface departments {
  title: string;
  reports?: [];
  reportFilters?: [];
}

type AttachReportCustomer = {
  customer: string;
  report: string;
};
interface AttachReportFilter {
  $schema: string;
  filterType: string;
  targetId: string;
  operator: string;
  values: [];
}

export const attachReport =
  (customerData: AttachReportCustomer) => async (dispatch: AppDispatch) => {
    const { customer, report } = await customerData;

    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
      const { status } = await api.post(`/customers/${customer}/reports/${report}/attach`);
      if (status == 200) {
        dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
        return true;
      }
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const attachReportToFilter =
  (filterData: AttachReportFilter[], report: string, customerId: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));

      await Promise.all(
        filterData.map(async filter => {
          const { status } = await api.post(
            `/customers/${customerId}/reports/${report}/filters`,
            filter,
          );
        }),
      );

      dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
      return true;
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const createCustomer = (customer: Customer) => async (dispatch: AppDispatch) => {
  try {
    dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
    const { data, status } = await api.post(`/customers`, customer);
    if (status == 200) {
      dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
      return true;
    }
  } catch (err: any) {
    dispatch(
      customerActions.controlView({
        isLoading: false,
        hasError: true,
        msgError: err.response.data.message,
      }),
    );
  }
};

export const updateCustomer =
  (customer: Customer, id: string | string[]) => async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
      const { data, status } = await api.put(`/customers/${id}`, customer);
      if (status == 200) {
        dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
        return true;
      }
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const createDepartment =
  (departments: departments, id: string | string[]) => async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
      const { data, status } = await api.post(`/customers/${id}/departments`, departments);
      if (status == 200) {
        dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
        return true;
      }
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const deleteDepartment =
  (departmentID: string | string[], customerID: string | string[]) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
      const { data, status } = await api.delete(
        `/customers/${customerID}/departments/${departmentID}`,
      );
      if (status == 204) {
        dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
        return true;
      }
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const editAssociateReport =
  (data: EditAssociateReport, reportId: string, customerId: string, departmentId: string) =>
  async (dispatch: AppDispatch) => {
    try {
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));
      const { status, data: reports } = await api.put(
        `/customers/${customerId}/departments/${departmentId}/reports/${reportId}`,
        data,
      );
      if (status == 200 || status == 204) {
        dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
        return reports;
      }
    } catch (err: any) {
      dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
    }
  };

export const desassociateReport =
  (reportId: string, departmentId: string, customerId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));
      const { status, data: reports } = await api.put(
        `/customers/${customerId}/departments/${departmentId}/reports/${reportId}/desassociate`,
      );
      if (status == 200) {
        dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
        return reports;
      }
    } catch (err: any) {
      dispatch(
        reportActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const updateStatusCustomer =
  (customerStatus: UpdateStatusCustomer, customerId: string) => async (dispatch: AppDispatch) => {
    try {
      dispatch(customerActions.controlView({ isLoading: true, hasError: false }));
      const { status } = await api.put(`/customers/${customerId}/users/status`, customerStatus);
      if (status == 204) {
        dispatch(customerActions.controlView({ isLoading: false, hasError: false }));
        return true;
      }
    } catch (err: any) {
      dispatch(
        customerActions.controlView({
          isLoading: false,
          hasError: true,
          msgError: err.response.data.message,
        }),
      );
    }
  };

export const customersApi = createApi({
  reducerPath: "customersApi",
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryMiddleware,
  endpoints: builder => ({
    getCustomers: builder.query({
      query: (params: Pagination) => ({
        url: `/customers`,
        method: "GET",
        params,
      }),
    }),
    getCustomerById: builder.query({
      query: (customerId: string | string[]) => ({
        url: `/customers/${customerId}`,
        method: "GET",
      }),
    }),
    getDepartmentsByCustomerID: builder.query({
      query: (customerId: string | string[]) => ({
        url: `/customers/${customerId}/departments`,
        method: "GET",
      }),
    }),
    getReportsByCustomerId: builder.query({
      query: (customerId: string) => ({
        url: `/customers/${customerId}/reports`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCustomersQuery,
  useLazyGetCustomersQuery,
  useLazyGetReportsByCustomerIdQuery,
  useLazyGetCustomerByIdQuery,
  useLazyGetDepartmentsByCustomerIDQuery,
} = customersApi;
