export interface EditAssociateReport {
  reportFilters: reportFilters[];
  reportPages: reportPages[];
  newDepartmentId?: string;
  deleteIds?: string[];
}

interface reportPages {
  name: string;
  displayName: string;
  visible: boolean;
}

interface reportFilters {
  targetId: string;
  operator: string;
  values: string[];
  conditions: conditions[];
}

interface conditions {
  operator: string;
  value: Date;
}
