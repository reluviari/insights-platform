export type UpdateResult = {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: any | null;
  upsertedCount: number;
  matchedCount: number;
};
