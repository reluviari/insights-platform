export type HealthCheckDbResultType = {
  dbAvailable: boolean;
  storageSize?: number;
  dataSize?: number;
  objects?: number;
  collections?: number;
  error?: string;
  duration?: number;
};
