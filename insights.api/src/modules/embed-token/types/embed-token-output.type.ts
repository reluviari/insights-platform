import { ReportPageType } from "@/modules/department/types";
import { ReportFilter } from "@/modules/report-filter/entities";

export type EmbedTokenOutputType = {
  token: string;
  reportFilters?: string[] | ReportFilter[];
  reportPages?: ReportPageType[];
};
