import { Customer } from "@/modules/customer/entities";
import { ReportFilter } from "@/modules/report-filter/entities";
import { Report } from "@/modules/report/entities";
import { ReportPageType } from "./report-page.type";

export type CreateDepartmentType = {
  title: string;
  reports?: string[] | Report[];
  reportFilters?: string[] | ReportFilter[];
  reportPages?: ReportPageType[];
  customer?: string | Customer;
  isActive: boolean;
};
