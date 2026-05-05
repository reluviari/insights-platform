import {
  AdvancedFilterConditionOperatorsEnum,
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "../enums";

class Condition {
  operator: AdvancedFilterConditionOperatorsEnum;
  value?: string | number | boolean | Date;
}

export interface CreateReportFilter {
  $schema: string;
  pages?: string[];
  filterType: FilterType;
  operator?: FilterOperatorsEnum;
  target: string;
  report: string;
  customer: string;
  values?: (string | number | boolean)[];
  requireSingleSelection?: boolean;
  logicalOperator?: AdvancedFilterLogicalOperatorsEnum;
  conditions?: Condition[];
  itemCount?: number;
  orderBy?: {
    table?: string;
    column?: string;
    displayName?: string;
    $schema?: string;
    hierarchy?: string;
    hierarchyLevel?: string;
    measure?: string;
    percentOfGrandTotal?: boolean;
    aggregationFunction?: string;
  };
  timeUnitsCount?: number;
  timeUnitType?: RelativeDateFilterTimeUnitEnum;
  includeToday?: boolean;
}
