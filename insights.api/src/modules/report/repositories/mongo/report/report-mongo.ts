import { Document } from "mongoose";
import { Report } from "@/modules/report/entities";

export interface ReportDocument extends Omit<Report, "_id">, Document {}
