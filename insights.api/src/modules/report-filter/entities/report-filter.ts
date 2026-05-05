import { Report } from "@/modules/report/entities";
import {
  AdvancedFilterConditionOperatorsEnum,
  AdvancedFilterLogicalOperatorsEnum,
  FilterOperatorsEnum,
  FilterType,
  RelativeDateFilterTimeUnitEnum,
} from "../enums";
import { Customer } from "@/modules/customer/entities";
import { TargetFilter } from "@/modules/target-filter/entities";

interface IFilterDisplaySettings {
  isLockedInViewMode?: boolean;
  isHiddenInViewMode?: boolean;
  displayName?: string;
}

interface IAdvancedFilterCondition {
  value?: Date;
  operator: AdvancedFilterConditionOperatorsEnum;
}

interface BaseFilter {
  _id?: string;
  $schema?: string;
  pages?: string[];
  report: string | Report;
  customer: string | Customer;
  target: TargetFilter;
  filterType: FilterType;
  displaySettings?: IFilterDisplaySettings;
}

interface BasicFilter extends BaseFilter {
  operator: FilterOperatorsEnum.In | FilterOperatorsEnum.NotIn | FilterOperatorsEnum.All;
  values: (string | number | boolean)[];
  requireSingleSelection?: boolean;
}

interface AdvancedFilter extends BaseFilter {
  logicalOperator: AdvancedFilterLogicalOperatorsEnum;
  conditions: IAdvancedFilterCondition[];
}

interface TopNFilter extends Omit<BaseFilter, "values"> {
  operator: FilterOperatorsEnum.Top | FilterOperatorsEnum.Bottom;
  itemCount: number;
  orderBy: {
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
}

interface RelativeDateTimeFilter extends Omit<BaseFilter, "values"> {
  operator: FilterOperatorsEnum.InLast | FilterOperatorsEnum.InThis | FilterOperatorsEnum.InNext;
  timeUnitsCount: number;
  timeUnitType: RelativeDateFilterTimeUnitEnum;
}

interface RelativeDateFilter extends RelativeDateTimeFilter {
  includeToday: boolean;
}

export type ReportFilter =
  | BasicFilter
  | AdvancedFilter
  | RelativeDateTimeFilter
  | RelativeDateFilter
  | TopNFilter;
