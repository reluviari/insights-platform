import { Report } from "../entities";

export interface IUserReportService {
  getUserReportByUserId(userId: string): Promise<{ reports: Report[] }>;
}
