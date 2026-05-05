import { DepartmentModel } from "./department.schema";
import { toDepartment } from "../utils";
import { Department } from "@/modules/department/entities";
import { IDepartmentRepository, WhereDepartment } from "@/modules/department/interfaces";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { CreateDepartmentType } from "@/modules/department/types/create-department.type";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";
import { PopulateOptions } from "@/commons/interfaces";
import { ReportPageDto } from "@/modules/department/dtos";

export class MongooseDepartmentRepository implements IDepartmentRepository {
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

  async create(data: CreateDepartmentType): Promise<Department> {
    const newDepartmentDoc = await this.handleErrors(DepartmentModel.create(data));

    return toDepartment(newDepartmentDoc.toObject());
  }

  async delete(id: string): Promise<Department | any> {
    const departmentDoc = await this.handleErrors(DepartmentModel.deleteOne({ _id: id }));

    return departmentDoc;
  }

  async findByTitle(title: string, customerId: string): Promise<Department> {
    const departmentDoc = await this.handleErrors(
      DepartmentModel.findOne({ title, customer: customerId }),
    );
    return departmentDoc ? toDepartment(departmentDoc) : null;
  }

  async findById(id: string, populates?: PopulateOptions[]): Promise<Department | null> {
    const departmentDoc = await this.handleErrors(
      DepartmentModel.findById(id).populate(populates).exec(),
    );

    return departmentDoc ? toDepartment(departmentDoc.toObject()) : null;
  }

  async listByReportIdAndCustomerId(reportId: string, customerId: string): Promise<Department[]> {
    try {
      const departmentDocs = await DepartmentModel.find({
        reports: reportId,
        customer: customerId,
      }).exec();

      return departmentDocs.length
        ? departmentDocs.map(departmentDoc => toDepartment(departmentDoc.toObject()))
        : [];
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listByCustomerId(customerId: string, populates?: PopulateOptions[]): Promise<Department[]> {
    try {
      const departmentDocs = await DepartmentModel.find({ customer: customerId })
        .populate(populates)
        .exec();

      return departmentDocs.length
        ? departmentDocs.map(departmentDoc => toDepartment(departmentDoc.toObject()))
        : [];
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listAll(where: WhereDepartment, page?: number, limit?: number): Promise<Department[]> {
    try {
      const pageNumber = page ? page - 1 : 0;
      const skipAmount = pageNumber * limit;

      const departmentDocs = await DepartmentModel.find(filterUndefinedFields(where))
        .skip(skipAmount)
        .limit(limit)
        .exec();

      return departmentDocs.length
        ? departmentDocs.map(departmentDoc => toDepartment(departmentDoc.toObject()))
        : [];
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(departmentId: string, data: any): Promise<Department> {
    const departmentDoc = await this.handleErrors(
      DepartmentModel.findOneAndUpdate({ _id: departmentId }, { $set: data }),
    );
    return departmentDoc ? toDepartment(departmentDoc.toObject()) : null;
  }

  async count(where: WhereDepartment): Promise<number> {
    try {
      const count = await DepartmentModel.count(filterUndefinedFields(where)).exec();

      return count || 0;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateDepartmentsReportFilters(reportFilterId: string): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateMany(
        { reportFilters: reportFilterId },
        { $pull: { reportFilters: reportFilterId } },
      ),
    );
  }

  async addReportToManyDepartments(departmentIds: string[], reportId: string): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateMany({ _id: { $in: departmentIds } }, { $push: { reports: reportId } }),
    );
  }

  async addReportFiltersToDepartment(
    departmentId: string,
    reportFilterIds: string[],
  ): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateOne(
        { _id: departmentId },
        { $push: { reportFilters: { $each: reportFilterIds } } },
      ),
    );
  }

  async addPagesToDepartment(
    reportId: string,
    departmentId: string,
    reportPages: ReportPageDto[],
  ): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateOne(
        { _id: departmentId },
        { $push: { reportPages: { reportId, pages: reportPages } } },
      ),
    );
  }

  async updatePages(reportId: string, data: ReportPageDto): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateOne(
        { "reportPages.reportId": reportId },
        { $set: { "reportPages.$.pages": data } },
      ),
    );
  }

  async updateReportPages(departmentId: string, data: ReportPageDto[]): Promise<void> {
    await this.handleErrors(
      DepartmentModel.updateOne({ _id: departmentId }, { $set: { reportPages: data } }),
    );
  }
}
