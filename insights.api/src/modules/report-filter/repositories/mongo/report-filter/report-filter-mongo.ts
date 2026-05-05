import { Document } from "mongoose";
import { ReportFilter } from "@/modules/report-filter/entities";

export interface ReportFilterDocument extends Omit<ReportFilter, "_id">, Document {}
