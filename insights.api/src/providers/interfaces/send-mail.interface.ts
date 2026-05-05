export interface SendMailParams {
  emailTo: string | string[];
  emailSubject: string;
  emailBody: string;
  emailFrom?: string;
  mailCopyList?: string[];
}
