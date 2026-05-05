import { Report } from "@/modules/report/entities";

export interface TargetFilter {
  _id?: string;
  report: string | Report;
  table: string;
  column: string;
  displayName?: string;
}
