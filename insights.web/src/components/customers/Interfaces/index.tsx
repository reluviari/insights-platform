export type ReportDetailComponentProps = {
  report: ReportDetail;
  handleToggleExpand: any;
  expandedIndex: number;
  index: number;
  key: number;
  onUpdateReportDetails: any;
  customerId: string;
};

export type ReportDetail = {
  id: string;
  title: string;
  icon: string;
  externalId: string;
  description: string;
  department: Department;
  reportFilters: any[];
  reportPages: ReportPages[];
  createdAt: string;
};

export type Department = {
  id: string;
  title: string;
  isActive: boolean;
};

export type ReportPages = {
  id?: string;
  name: string;
  displayName: string;
  visible?: boolean;
  order: number;
};
