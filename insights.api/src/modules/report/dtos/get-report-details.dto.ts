import { BaseDto } from "@/commons/dtos";
import {
  AdvancedFilterDto,
  BaseFilterDto,
  BasicFilterDto,
  RelativeDateTimeFilterDto,
  RelativeTimeFilterDto,
  TopNFilterDto,
} from "@/modules/report-filter/dtos";
import { FilterType } from "@/modules/report-filter/enums";
import { Expose, Type } from "class-transformer";

export class GetReportDetailsDto extends BaseDto {
  @Expose()
  title: string;

  @Expose()
  icon: string;

  @Expose()
  externalId: string;

  @Expose()
  description: string;

  @Expose()
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
  reportFilters:
    | BasicFilterDto[]
    | AdvancedFilterDto[]
    | TopNFilterDto[]
    | RelativeDateTimeFilterDto[]
    | RelativeTimeFilterDto[];

  @Expose()
  createdAt?: Date;
}
