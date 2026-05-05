import { IUserRepository } from "@/modules/user/interfaces";
import { SendMailDefinePasswordDto } from "../dtos";
import { sendEmail } from "@/providers/email.provider";
import { resetPasswordTemplate } from "@/providers/templates/reset-password";
import { TypeMail } from "@/providers/enums";
import { HttpStatus, ResponseError } from "@foundation/lib";
import { ExceptionsConstants } from "@/commons/consts/exceptions";
import { generatePasswordToken } from "@/modules/user/utils/generate-password-token";
import { welcomeAndCreatePasswordTemplate } from "@/providers/templates/welcome-and-create-password";

export class SendMailDefinePasswordUseCase {
  constructor(private userRepository: IUserRepository) {}

  async execute(body: SendMailDefinePasswordDto) {
    const { email, type } = body;

    const user = await this.userRepository.findUserByEmail(email);

    if (user) {
      if (type === TypeMail.DEFINE_PASSWORD && user.password) {
        throw new ResponseError(
          ExceptionsConstants.PASSWORD_ALREADY_EXIST,
          HttpStatus.UNAUTHORIZED,
        );
      }

      const passwordToken = generatePasswordToken(user._id, email);

      const htmlTemplate = this.typeMailTemplate(type, user.name, passwordToken);

      await sendEmail({
        emailTo: email,
        emailSubject: TypeMail.WELCOME ? "Bem-vindo ao Insights Platform" : "Definição de Senha",
        emailBody: htmlTemplate,
      });

      await this.userRepository.update({ id: user._id }, { passwordToken });
    }
  }

  typeMailTemplate(type: TypeMail, name: string, token: string) {
    const passwordPageUrl = `${process.env.SITE_URL}/create-password?token=${token}`;
    const handleTypeMail = {
      [TypeMail.DEFINE_PASSWORD]: welcomeAndCreatePasswordTemplate(name, passwordPageUrl),
      [TypeMail.WELCOME]: welcomeAndCreatePasswordTemplate(name, passwordPageUrl),
      [TypeMail.RESET_PASSWORD]: resetPasswordTemplate(name, passwordPageUrl),
    };

    return handleTypeMail[type];
  }
}
