import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { toTargetFilter } from "../utils";
import { TargetFilter } from "@/modules/target-filter/entities";
import { TargetFilterModel } from "./target-filter.schema";
import {
  CreateTargetFilter,
  ITargetFilterRepository,
  UpdateTargetFilter,
  WhereTargetFilter,
} from "@/modules/target-filter/interfaces";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";

export class MongooseTargetFilterRepository implements ITargetFilterRepository {
  private async handleErrors<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listAll(
    { table, column, displayName, ...where }: WhereTargetFilter,
    page?: number,
    limit?: number,
  ): Promise<TargetFilter[]> {
    const pageNumber = page ? page - 1 : 0;
    const skipAmount = pageNumber * limit;

    const targetFilterFieldsWhere = filterUndefinedFields({
      table: table ? { $regex: table, $options: "i" } : undefined,
      column: column ? { $regex: column, $options: "i" } : undefined,
      displayName: displayName ? { $regex: displayName, $options: "i" } : undefined,
      ...where,
    });

    const targetDocs = await this.handleErrors(
      TargetFilterModel.find(targetFilterFieldsWhere).skip(skipAmount).limit(limit).exec(),
    );

    return targetDocs.length
      ? targetDocs.map(targetDoc => toTargetFilter(targetDoc.toObject()))
      : [];
  }

  async count({ table, column, displayName, ...where }: WhereTargetFilter): Promise<number> {
    const targetFilterFieldsWhere = filterUndefinedFields({
      table: table ? { $regex: table, $options: "i" } : undefined,
      column: column ? { $regex: column, $options: "i" } : undefined,
      displayName: displayName ? { $regex: displayName, $options: "i" } : undefined,
      ...where,
    });

    const count = await this.handleErrors(TargetFilterModel.count(targetFilterFieldsWhere).exec());

    return count || 0;
  }

  async create(data: CreateTargetFilter): Promise<TargetFilter | null> {
    const targetFilterDoc = await this.handleErrors(TargetFilterModel.create(data));

    return targetFilterDoc ? toTargetFilter(targetFilterDoc.toObject()) : null;
  }

  async update(targetFilterId: string, data: UpdateTargetFilter): Promise<TargetFilter | null> {
    const targetFilterDoc = await this.handleErrors(
      TargetFilterModel.findOneAndUpdate({ _id: targetFilterId }, { $set: data }, { new: true }),
    );

    return targetFilterDoc ? toTargetFilter(targetFilterDoc.toObject()) : null;
  }

  async findById(id: string): Promise<TargetFilter | null> {
    const targetFilterDoc = await this.handleErrors(TargetFilterModel.findById(id).exec());

    return targetFilterDoc ? toTargetFilter(targetFilterDoc.toObject()) : null;
  }

  async findByReportIdAndColumnAndTableAndDisplayName(
    reportId: string,
    column: string,
    table: string,
    displayName: string,
  ): Promise<TargetFilter | null> {
    const targetFilterDoc = await this.handleErrors(
      TargetFilterModel.findOne({ report: reportId, column, table, displayName }).exec(),
    );

    return targetFilterDoc ? toTargetFilter(targetFilterDoc.toObject()) : null;
  }

  async listByReportId(reportId: string): Promise<TargetFilter[] | null> {
    const targetFilterDocs = await this.handleErrors(
      TargetFilterModel.find({ report: reportId }).exec(),
    );

    return targetFilterDocs.length
      ? targetFilterDocs.map(targetFilterDoc => toTargetFilter(targetFilterDoc.toObject()))
      : [];
  }

  async delete(targetFilterId: string): Promise<void> {
    await this.handleErrors(TargetFilterModel.deleteOne({ _id: targetFilterId }));
  }
}
