import { UserModel } from "./user.schema";
import { User } from "@/modules/user/entities";
import { toUser } from "../utils";
import { IUserRepository, UpdateUser, WhereUser } from "@/modules/user/interfaces";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { CustomerModel } from "@/modules/customer/repositories/mongo/customer/customer.schema";
import { filterUndefinedFields } from "@/utils/filter-undefined-fields";
import { UpdateResult } from "@/types";
import { PopulateOptions } from "@/commons/interfaces";

export class MongooseUserRepository implements IUserRepository {
  private async handleErrors<T>(promise: Promise<T>): Promise<T> {
    try {
      return await promise;
    } catch (error) {
      if (error?.message.includes("failed: roles.0")) {
        throw new ResponseError(ExceptionsConstants.INVALID_ROLE, HttpStatus.BAD_REQUEST);
      }

      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async create(data: User): Promise<User> {
    const userDoc = await this.handleErrors(UserModel.create(data));
    return userDoc ? toUser(userDoc.toObject()) : null;
  }

  async updateMany(data: User[]): Promise<UpdateResult | null> {
    const userIds = data.map(user => user._id);

    const update = {
      $set: {
        departments: data.map(user => user.departments),
      },
    };

    const userDoc = await this.handleErrors(
      UserModel.updateMany({ _id: { $in: userIds } }, update),
    );

    return userDoc ? userDoc : null;
  }

  async listUserByDepartmentId(departmentId: string): Promise<User[]> {
    const userDocs = await this.handleErrors(UserModel.find({ departments: departmentId }).exec());

    return userDocs.length ? userDocs.map(userDoc => toUser(userDoc.toObject())) : [];
  }

  async findUserByEmail(
    email: string,
    populates?: PopulateOptions[],
    includePasswordHash?: boolean,
  ): Promise<User | null> {
    const normalized =
      typeof email === "string" ? email.normalize("NFKC").trim().toLowerCase() : "";

    if (!normalized) {
      return null;
    }

    /* Campos com schema `select: false` (ex.: password): usar lean() para o plain object
     * incluir o hash — Document#toObject() pode omitir mesmo após .select('+password'). */
    if (includePasswordHash) {
      let q = UserModel.findOne({ email: normalized }).select("+password");
      if (populates?.length) {
        q = q.populate(populates);
      }
      const plain = await this.handleErrors(q.lean().exec());
      return plain ? toUser(plain) : null;
    }

    let query = UserModel.findOne({ email: normalized });

    if (populates?.length) {
      query = query.populate(populates);
    }

    const userDoc = await this.handleErrors(query.exec());

    return userDoc ? toUser(userDoc.toObject()) : null;
  }

  async findUserByPasswordToken(
    passwordToken: string,
    populates?: PopulateOptions[],
  ): Promise<User | null> {
    const userDoc = await this.handleErrors(
      UserModel.findOne({ passwordToken }).populate(populates).exec(),
    );

    return userDoc ? toUser(userDoc.toObject()) : null;
  }

  async findUserById(id: string, populates?: PopulateOptions[]): Promise<User | null> {
    const userDoc = await this.handleErrors(UserModel.findById(id).populate(populates).exec());

    return userDoc ? toUser(userDoc.toObject()) : null;
  }

  async listUserByCustomerId(customerId: string, page?: number, limit?: number): Promise<User[]> {
    try {
      const pageNumber = page ? page - 1 : 0;
      const skipAmount = pageNumber * limit;

      const userDocs = await UserModel.find({ customer: customerId })
        .skip(skipAmount)
        .limit(limit)
        .exec();

      return userDocs.length ? userDocs.map(userDoc => toUser(userDoc.toObject())) : [];
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async countUserByCustomerId(customerId: string): Promise<number> {
    try {
      const count = await UserModel.count({ customer: customerId }).exec();

      return count || 0;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listUserByTenantId(
    { name, ...where }: WhereUser,
    page?: number,
    limit?: number,
    populates?: PopulateOptions[],
  ): Promise<User[]> {
    const pageNumber = page ? page - 1 : 0;
    const skipAmount = pageNumber * limit;

    const customers = await CustomerModel.find(filterUndefinedFields(where)).exec();
    const customerIds = customers.map(customer => customer._id);

    const userFieldsWhere = filterUndefinedFields({
      name: name ? { $regex: name, $options: "i" } : undefined,
    });

    const userDocs = await this.handleErrors(
      UserModel.find({
        customer: { $in: customerIds },
        ...userFieldsWhere,
      })
        .populate(populates)
        .skip(skipAmount)
        .limit(limit)
        .exec(),
    );

    return userDocs.length ? userDocs.map(userDoc => toUser(userDoc.toObject())) : [];
  }

  async countUserByTenantId({ name, ...where }: WhereUser): Promise<number> {
    try {
      const customers = await CustomerModel.find(filterUndefinedFields(where)).exec();
      const customerIds = customers.map(customer => customer._id);

      const userFieldsWhere = filterUndefinedFields({
        name: name ? { $regex: name, $options: "i" } : undefined,
      });

      const count = await UserModel.count({
        customer: { $in: customerIds },
        ...userFieldsWhere,
      }).exec();

      return count || 0;
    } catch (error) {
      throw new ResponseError(
        ExceptionsConstants.INTERNAL_SERVER_ERROR,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(filter: { id: string }, data: UpdateUser): Promise<User> {
    const { id } = filter;
    const userDoc = await this.handleErrors(
      UserModel.findOneAndUpdate({ _id: id }, data, { new: true }),
    );

    return userDoc ? toUser(userDoc.toObject()) : null;
  }

  async updateUsersReportFilters(reportFilterId: string): Promise<void> {
    await this.handleErrors(
      UserModel.updateMany(
        { reportFilters: reportFilterId },
        { $pull: { reportFilters: reportFilterId } },
      ),
    );
  }

  async updateUsersDepartments(departmentId: string): Promise<void> {
    await this.handleErrors(
      UserModel.updateMany({ departments: departmentId }, { $pull: { departments: departmentId } }),
    );
  }
}
