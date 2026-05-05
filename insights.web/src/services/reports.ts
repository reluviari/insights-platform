import { createApi } from "@reduxjs/toolkit/query/react";
import { FilterReports } from "@src/shared/interfaces/filter-reports.interface";
import { AppDispatch, RootState } from "@src/store";
import { reportActions } from "@src/store/slices/reports";
import { selectTargetFilters } from "@src/store/slices/reports/selectors";

import { api, baseQueryMiddleware } from "./api";
import { createTargetFilter, deleteTargetFilter, updateTargetFilter } from "./target-filter";

export interface IReportDataUpdate {
  id: string;
  title?: string;
  description?: string;
  icon?: string;
  isActive?: boolean;
  filters?: IFilter[];
}

interface IFilter {
  displayName: string;
  id: string;
  column: string;
  table: string;
}
interface reportPages {
  name: string;
  visible: boolean;
}

interface reportFilters {
  $schema: string;
  filterType: string;
  targetId: string;
  operator: string;
  values: string[];
}

interface AttachReportToDepartment {
  departmentId: string;
  report: string;
  reportPages: reportPages[];
  reportFilters: reportFilters[];
}

export const getReports = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(reportActions.controlView({ isLoading: true, hasError: false }));

    const { data, status } = await api.get(`/reports`);
    if (status == 200) dispatch(reportActions.controlData({ reports: data }));
    dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
  } catch (err: any) {
    dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
  }
};

export const deleteReport =
  (id: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));

      const { status } = await api.delete(`/reports/${id}`);
      if (status !== 204) throw new Error("Erro ao excluir relatório");
      dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
    } catch (err: any) {
      dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
      throw new Error(err.message);
    }
  };

export const updateStatusReport =
  (report: IReportDataUpdate) =>
  async (dispatch: AppDispatch): Promise<void> => {
    try {
      const { id, title, isActive } = report;
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));

      const { status } = await api.put(`/reports/${id}`, {
        title,
        isActive,
        reportId: id,
      });

      if (status !== 200) throw new Error("Erro ao atualizar relatório");

      dispatch(reportsApi.util.invalidateTags(["UserReports"]));

      dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
    } catch (err: any) {
      dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
      throw new Error(err.message);
    }
  };

//TODO 2520
export const updateReport =
  (report: IReportDataUpdate) =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    try {
      const { id, title, description, icon, isActive, filters } = report;
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));
      const lastFilters = selectTargetFilters(getState(), id);

      const { status } = await api.put(`/reports/${id}`, {
        title,
        description,
        icon,
        isActive,
        reportId: id,
      });

      if (status !== 200) throw new Error("Erro ao atualizar relatório");

      if (filters) {
        for (const filter of filters) {
          const hasUpdate = lastFilters.find(f => f.id === filter.id);
          if (hasUpdate) {
            if (
              hasUpdate.column === filter.column &&
              hasUpdate.table === filter.table &&
              hasUpdate.displayName === filter.displayName
            )
              continue;

            await updateTargetFilter({
              id: filter.id,
              reportId: id,
              column: filter.column,
              table: filter.table,
              displayName: filter.displayName,
            });

            continue;
          }

          await createTargetFilter({
            reportId: id,
            column: filter.column,
            table: filter.table,
            displayName: filter.displayName,
          });
        }
      }

      const itemsToRemove = lastFilters.filter(
        lastFilter => !filters?.some(filter => lastFilter.id === filter.id),
      );

      for (const itemToRemove of itemsToRemove) {
        await deleteTargetFilter({ reportId: id, id: itemToRemove.id });
      }

      dispatch(reportsApi.util.invalidateTags(["UserReports"]));

      dispatch(reportActions.controlView({ isLoading: false, hasError: false }));
    } catch (err: any) {
      dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
      throw new Error(err.message);
    }
  };

export const attachReportToDepartment =
  (data: AttachReportToDepartment, customerId: string) => async (dispatch: AppDispatch) => {
    const { report } = await data;
    try {
      dispatch(reportActions.controlView({ isLoading: true, hasError: false }));
      const { status, data: reports } = await api.post(
        `/customers/${customerId}/reports/${report}/attach-to-departments`,
        data,
      );
      if (status == 200 || status == 204) {
        dispatch(reportActions.controlView({ isLoading: false, hasError: false }));

        dispatch(reportsApi.util.invalidateTags(["UserReports"]));

        return reports;
      }
    } catch (err: any) {
      dispatch(reportActions.controlView({ isLoading: false, hasError: true }));
    }
  };

export const reportsApi = createApi({
  reducerPath: "reportsApi",
  refetchOnMountOrArgChange: true,
  baseQuery: baseQueryMiddleware,
  tagTypes: ["UserReports"],
  endpoints: builder => ({
    getReports: builder.query({
      query: (params: FilterReports) => ({
        url: "/reports",
        method: "GET",
        params,
      }),
    }),
    getUserReports: builder.query({
      query: () => ({
        url: "/me/user-reports",
        method: "GET",
      }),
      providesTags: ["UserReports"],
    }),
    getReport: builder.query({
      query: ({ workspaceId, externalId }) => ({
        url: "/embed-token",
        method: "POST",
        body: { workspaceId, externalId },
      }),
    }),
    getReportDetails: builder.query({
      query: ({ id }) => ({
        url: `/reports/${id}`,
        method: "GET",
      }),
    }),
    getTargetFilters: builder.query({
      query: ({ reportId }: { reportId: string }) => ({
        url: `/reports/${reportId}/target-filters?page=1&pageSize=999`,
        method: "GET",
      }),
    }),
    getSynchronizeReport: builder.query({
      query: () => ({
        url: `/reports/synchronize`,
        method: "POST",
      }),
    }),
    getReportPages: builder.query({
      query: ({ reportId }: { reportId: string }) => ({
        url: `/reports/${reportId}/pages`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetReportsQuery,
  useGetUserReportsQuery,
  useGetReportQuery,
  useLazyGetReportQuery,
  useGetReportDetailsQuery,
  useLazyGetReportDetailsQuery,
  useGetSynchronizeReportQuery,
  useLazyGetSynchronizeReportQuery,
  useLazyGetTargetFiltersQuery,
  useGetReportPagesQuery,
  useLazyGetReportPagesQuery,
} = reportsApi;
