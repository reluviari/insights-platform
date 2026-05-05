import { Expose } from "class-transformer";

export class OrderByFilterDto {
  @Expose()
  table?: string;

  @Expose()
  column?: string;

  @Expose()
  displayName?: string;

  @Expose()
  $schema?: string;

  @Expose()
  hierarchy?: string;

  @Expose()
  hierarchyLevel?: string;

  @Expose()
  measure?: string;

  @Expose()
  percentOfGrandTotal?: boolean;

  @Expose()
  aggregationFunction?: string;
}
