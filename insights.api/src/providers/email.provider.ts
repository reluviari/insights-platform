import AWS from "aws-sdk";
import { SendMailParams } from "./interfaces";
import logger from "./logger.provider";



const AWS_ACCESS_KEY_ID = process.env?.INSIGHTS_ADMIN_CREDENTIALS?.split(";")[0];
const AWS_SECRET_KEY = process.env?.INSIGHTS_ADMIN_CREDENTIALS?.split(";")[1];
const EMAILSOURCE = process.env?.AWS_SOURCE_EMAIL;

AWS.config.update({
  accessKeyId: AWS_ACCESS_KEY_ID,
  secretAccessKey: AWS_SECRET_KEY,
  region: "us-east-1",
});

const ses = new AWS.SES();

export async function sendEmail({
  emailTo,
  emailSubject,
  emailBody,
  emailFrom,
  mailCopyList,
}: SendMailParams) {
  const params: AWS.SES.SendEmailRequest = {
    Destination: {
      ToAddresses: Array.isArray(emailTo) ? emailTo : [emailTo],
      BccAddresses: mailCopyList,
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: emailBody,
        },
        Text: {
          Charset: "UTF-8",
          Data: emailBody,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: emailSubject,
      },
    },
    Source: emailFrom || EMAILSOURCE,
  };

  logger.debug({
    message: "SES Send Email initialized",
    params: {
      Destination: params.Destination,
      Source: params.Source,
    },
    timestamp: new Date(),
  });

  try {
    await ses.sendEmail(params).promise();

    logger.debug({
      message: "Email sent successfully",
      sesRequestDetails: { source: params.Source, destination: params.Destination },
      timestamp: new Date(),
    });
  } catch (err) {
    logger.debug({
      message: "Erro to send e-mail",
      errorDetails: {
        errorMessage: err?.message,
        errorCode: err?.code,
        sesRequestDetails: params,
      },
      timestamp: new Date(),
    });
  }
}
