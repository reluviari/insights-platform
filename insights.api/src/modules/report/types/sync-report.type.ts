import { Report } from "../entities";

export type SyncReportType = {
  createdReports: number;
  reports: Report[];
};
