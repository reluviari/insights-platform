import { ReportFilter } from "@/modules/report-filter/entities";
import { Report } from "@/modules/report/entities";
import { Customer } from "@/modules/customer/entities";

export interface Department {
  _id?: string;
  title: string;
  customer: string | Customer;
  isActive: boolean;
  reports?: string[] | Report[];
  reportFilters?: string[] | ReportFilter[];
  reportPages?: {
    reportId: string;
    name: string;
    visible: boolean;
    _id?: string;
    pages?: any;
  }[];
}
