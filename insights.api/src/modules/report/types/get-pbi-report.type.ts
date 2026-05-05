type ValueType = {
  id: string;
  reportType: string;
  name: string;
  webUrl: string;
  embedUrl: string;
  isFromPbix: boolean;
  isOwnedByMe: boolean;
  datasetId: string;
  datasetWorkspaceId: string;
  users: string[];
  subscriptions: string[];
};

export type PowerBIReportType = {
  value: ValueType[];
};
