import { api } from "./api";

interface ICreateTargetFilter {
  reportId: string;
  column: string;
  table: string;
  displayName: string;
}

interface IUpdateTargetFilter {
  id: string;
  reportId: string;
  column: string;
  table: string;
  displayName: string;
}

interface IDeleteTargetFilter {
  id: string;
  reportId: string;
}

export async function createTargetFilter(params: ICreateTargetFilter) {
  const { reportId, column, table, displayName } = params;

  return api.post(`/reports/${reportId}/target-filters`, {
    column,
    table,
    displayName,
  });
}

export async function updateTargetFilter(params: IUpdateTargetFilter) {
  const { reportId, column, table, displayName, id } = params;

  return api.put(`/reports/${reportId}/target-filters/${id}`, {
    column,
    table,
    displayName,
  });
}

export async function deleteTargetFilter(params: IDeleteTargetFilter) {
  const { reportId, id } = params;

  return api.delete(`/reports/${reportId}/target-filters/${id}`);
}
