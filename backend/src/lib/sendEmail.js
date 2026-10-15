
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
  connectionTimeout: 10_000,
  greetingTimeout: 10_000,
  socketTimeout: 20_000,
});

export const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    html,
  });
};

export const verifyEmailConnection = async () => {
  return transporter.verify();
};


// import { Resend } from "resend";

// const resend = new Resend(process.env.RESEND_API_KEY);

// export const sendEmail = async ({ to, subject, html }) => {
//   const { data, error } = await resend.emails.send({
//     from: "MyCode Academy <onboarding@resend.dev>",
//     to,
//     subject,
//     html,
//   });

//   if (error) {
//     throw new Error(error.message);
//   }

//   return data;
// };