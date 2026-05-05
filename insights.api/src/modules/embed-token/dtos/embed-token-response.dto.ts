import { BaseDto } from "@/commons/dtos";
import { GetReportPageDto } from "@/modules/department/dtos";
import {
  AdvancedFilterDto,
  BaseFilterDto,
  BasicFilterDto,
  RelativeTimeFilterDto,
  RelativeDateTimeFilterDto,
  TopNFilterDto,
} from "@/modules/report-filter/dtos";
import { FilterType } from "@/modules/report-filter/enums";
import { Expose, Type } from "class-transformer";

export class EmbedTokenResponseDTO extends BaseDto {
  @Expose()
  token: string;

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
  reportPages: GetReportPageDto[];
}
