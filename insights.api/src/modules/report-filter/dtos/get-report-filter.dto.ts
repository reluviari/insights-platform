import { Type } from "class-transformer";
import { ValidateNested } from "class-validator";
import {
  BasicFilterDto,
  AdvancedFilterDto,
  RelativeDateTimeFilterDto,
  RelativeTimeFilterDto,
  TopNFilterDto,
  BaseFilterDto,
} from "./base-filter.dto";
import { BaseDto } from "@/commons/dtos";
import { FilterType } from "../enums";

export class ReportFilterDto extends BaseDto {
  @ValidateNested()
  @Type(() => BaseFilterDto, {
    discriminator: {
      property: "filterType",
      subTypes: [
        { value: BasicFilterDto, name: String(FilterType.Basic) },
        { value: AdvancedFilterDto, name: String(FilterType.Advanced) },
        { value: RelativeDateTimeFilterDto, name: String(FilterType.RelativeDate) },
        { value: TopNFilterDto, name: String(FilterType.TopN) },
        { value: RelativeTimeFilterDto, name: String(FilterType.RelativeTime) },
      ],
    },
  })
  filter:
    | BasicFilterDto
    | AdvancedFilterDto
    | RelativeDateTimeFilterDto
    | TopNFilterDto
    | RelativeTimeFilterDto;
}
