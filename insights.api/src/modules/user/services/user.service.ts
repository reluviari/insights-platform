import { CreateUserUseCase } from "../use-cases/create-user.use-case";
import { UpdateUserUseCase } from "../use-cases/update-user.use-case";
import { IUserService } from "../interfaces/user-service.interface";
import { ListUserByTenantUrlSlugUseCase } from "../use-cases/list-user-by-tenant-url-slug.use-case";
import { CreateUserDto, FilterUserDto, UpdateUserDto } from "../dtos";
import { User } from "../entities";
import { FindByIdUseCase } from "../use-cases/find-by-id.use-case";
import { welcomeAndCreatePasswordTemplate } from "@/providers/templates/welcome-and-create-password";
import { TypeMail } from "@/providers/enums";
// import { sendEmail } from "@/providers/email.provider";
import { generatePasswordToken } from "../utils/generate-password-token";

export class UserService implements IUserService {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private listUserByTenantUrlSlugUseCase: ListUserByTenantUrlSlugUseCase,
    private findByIdUseCase: FindByIdUseCase,
  ) {}

  listUsersByTenantUrlSlug(urlSlug: string, filter: FilterUserDto) {
    return this.listUserByTenantUrlSlugUseCase.execute(urlSlug, filter);
  }

  async create(tenantId: string, customerId: string, data: CreateUserDto): Promise<User> {
    const user = await this.createUserUseCase.execute(tenantId, customerId, data);

    const passwordToken = generatePasswordToken(user._id, data?.email);

    await this.updateUserUseCase.update(tenantId, user._id, { passwordToken });

    // const htmlTemplate = this.typeMailTemplate(user.name, passwordToken);

    // await sendEmail({
    //   emailTo: data?.email,
    //   emailSubject: "Bem-vindo ao Insights Platform",
    //   emailBody: htmlTemplate,
    // });

    return user;
  }

  findById(tenantId: string, customerId: string, userId: string): Promise<User | null> {
    return this.findByIdUseCase.execute(tenantId, customerId, userId);
  }

  update(tenantId: string, userId: string, data: UpdateUserDto): Promise<User> {
    return this.updateUserUseCase.update(tenantId, userId, data);
  }

  typeMailTemplate(name: string, token: string) {
    const handleTypeMail = {
      [TypeMail.DEFINE_PASSWORD]: welcomeAndCreatePasswordTemplate(
        name,
        `${process.env.SITE_URL}/create-password?token=${token}`,
      ),
    };

    return handleTypeMail[TypeMail.DEFINE_PASSWORD];
  }
}
