import { CustomerModel } from "./customer.schema";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { toCustomer } from "../utils";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";
import { ICustomerRepository, WhereCustomer } from "@/modules/customer/interfaces";
import { Customer } from "@/modules/customer/entities";
import { PopulateOptions } from "@/commons/interfaces";
import { UpdateCustomerDto } from "@/modules/customer/dtos";

export class MongooseCustomerRepository implements ICustomerRepository {
  private async handleErrors<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(customerId: string, data: UpdateCustomerDto): Promise<Customer> {
    const customerDoc = await this.handleErrors(
      CustomerModel.findOneAndUpdate({ _id: customerId }, { $set: data }),
    );

    return customerDoc ? toCustomer(customerDoc.toObject()) : null;
  }

  async findById(customerId: string, populates?: PopulateOptions[]): Promise<Customer> {
    const customerDoc = await this.handleErrors(
      CustomerModel.findById(customerId).populate(populates).exec(),
    );

    return customerDoc ? toCustomer(customerDoc.toObject()) : null;
  }

  async create(data: Customer): Promise<Customer> {
    const customerDoc = await this.handleErrors(CustomerModel.create(data));

    return toCustomer(customerDoc.toObject());
  }

  async listAll(
    where?: WhereCustomer,
    page?: number,
    limit?: number,
    populates?: PopulateOptions[],
  ): Promise<Customer[]> {
    const pageNumber = page ? page - 1 : 0;
    const skipAmount = pageNumber * limit;

    const customerDocs = await this.handleErrors(
      CustomerModel.find(filterUndefinedFields(where))
        .populate(populates)
        .skip(skipAmount)
        .limit(limit)
        .exec(),
    );

    return customerDocs.length
      ? customerDocs.map(customerDoc => toCustomer(customerDoc.toObject()))
      : [];
  }

  async count(where: WhereCustomer): Promise<number> {
    const count = await this.handleErrors(CustomerModel.count(filterUndefinedFields(where)).exec());

    return count || 0;
  }

  async findByDocument(document: string): Promise<Customer> {
    const customerDoc = await this.handleErrors(CustomerModel.findOne({ document }));

    return customerDoc ? toCustomer(customerDoc.toObject()) : null;
  }
}
