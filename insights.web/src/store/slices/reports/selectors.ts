import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "@src/store";

import { initialState as reportInitialState } from ".";

const selectSlice = (state: RootState) => state.report || reportInitialState;

export const selectReportLoading = createSelector([selectSlice], state => state.view.isLoading);

export const selectReportError = createSelector([selectSlice], state => state.view.hasError);

export const selectReportData = createSelector([selectSlice], state => state.data);

export const selectReportView = createSelector([selectSlice], state => state.view);

export const selectTargetFilters = (state: RootState, reportId: string) => {
  const queries = state.reportsApi.queries;

  const targetFilterQuery = queries[`getTargetFilters({"reportId":"${reportId}"})`];

  if (!targetFilterQuery || !targetFilterQuery?.data) return [];

  return (targetFilterQuery?.data as { rows: any[] }).rows || [];
};
