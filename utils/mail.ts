import { createTransport } from "nodemailer";
import { ENV } from "../config/env-variables";

const transport = createTransport({
  host: ENV.MAIL_HOST,
  port: ENV.MAIL_PORT,
  auth: {
    user: ENV.MAIL_USERNAME,
    pass: ENV.MAIL_PASSWORD,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  message: string
) => {
  await transport.sendMail({
    from: ENV.MAIL_USERNAME_EMAIL,
    to,
    subject,
    html: message,
  });
};
