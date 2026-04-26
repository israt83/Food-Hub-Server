import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.APP_USER,
    pass: process.env.APP_PASSWORD,
  },
});

export const auth = betterAuth({
   secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // trustedOrigins: [process.env.FRONTEND_URL!],
  trustedOrigins: async (request) => {
    const origin = request?.headers.get("origin");

    const allowedOrigins = [
      process.env.FRONTEND_URL,
      process.env.BETTER_AUTH_URL,
      "http://localhost:3000",
      "http://localhost:4000",
      "http://localhost:5000",
      "https://food-hub-web.vercel.app ",
      "https://food-hub-server-mu.vercel.app ",
    ].filter(Boolean);

    // Check if origin matches allowed origins or Vercel pattern
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin)
    ) {
      return [origin];
    }

    return [];
  },
  basePath: "/api/auth",
  // session: {
  //   cookieCache: {
  //     enabled: true,
  //     maxAge: 5 * 60, // 5 minutes
  //   },
  // },

  // advanced: {
  //   cookiePrefix: "better-auth",
  //   useSecureCookies: process.env.NODE_ENV === "production",
  //   crossDomain: {
  //     enabled: true,
  //   },
  //   // Required for cross-domain OAuth: cookies must be SameSite=None so they are
  //   // stored via cross-origin fetch (sign-in initiation) AND sent back when Google
  //   // redirects to the backend callback (cross-site top-level navigation).
  //   // Better Auth defaults to SameSite=Lax which fails in this split-domain setup.
  //   defaultCookieAttributes: {
  //     sameSite: "none",
  //     secure: true,
  //   },
  //   disableCSRFCheck: true,
  // },

  // account: {
  //   skipStateCookieCheck: true,
  // },

  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      status: {
        type: "string",
        defaultValue: "ACTIVE",
        required: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url, token }, request) => {
      try {
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
        const info = await transporter.sendMail({
          from: '"Food Hub" <foodhubcontact@gmail.com>',
          to: user.email,
          subject: "Verify your email from – FoodHub",
          text: `
Hi ${user.name || "there"},

Welcome to FoodHub 

Thanks for creating your FoodHub account. Please verify your email address by clicking the link below:

${verificationUrl}

This helps us keep your account secure and ensures you don’t miss important updates.

If you didn’t create this account, you can safely ignore this email.

— FoodHub Team
`,
          html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verify your email</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:10px;overflow:hidden;max-width:100%;">
          
          <!-- Header -->
          <tr>
            <td style="background:#16a34a;padding:24px;text-align:center;">
              <h1 style="color:#ffffff;margin:0;font-size:26px;letter-spacing:0.5px;">
               FoodHub
              </h1>
              <p style="margin:6px 0 0;color:#dcfce7;font-size:14px;">
                Discover & Order Delicious Meals
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;color:#111827;">
              <h2 style="margin-top:0;font-size:22px;">
                Verify your email address
              </h2>

              <p style="font-size:15px;line-height:1.6;">
                Hi <strong>${user.name || "there"}</strong>,
              </p>

              <p style="font-size:15px;line-height:1.6;">
                Thanks for joining <strong>FoodHub</strong>!  
                To complete your registration and start ordering delicious meals,
                please verify your email address.
              </p>

              <!-- Button -->
              <div style="text-align:center;margin:32px 0;">
                <a href="${verificationUrl}"
                  style="
                    background:#16a34a;
                    color:#ffffff;
                    padding:14px 32px;
                    text-decoration:none;
                    border-radius:8px;
                    font-weight:600;
                    font-size:15px;
                    display:inline-block;
                  "
                >
                  Verify Email
                </a>
              </div>

              <p style="font-size:14px;color:#374151;line-height:1.6;">
                If the button doesn’t work, copy and paste this link into your browser:
              </p>

              <p style="font-size:13px;color:#16a34a;word-break:break-all;">
                ${verificationUrl}
              </p>

              <p style="font-size:14px;color:#6b7280;line-height:1.6;margin-top:24px;">
                If you didn’t create a FoodHub account, you can safely ignore this email.
              </p>

              <p style="margin-top:32px;font-size:14px;color:#111827;">
                — FoodHub Team
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:20px;text-align:center;font-size:12px;color:#6b7280;">
              © ${new Date().getFullYear()} FoodHub. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
        });

        // console.log("Message sent:", info.messageId);
      } catch (error) {
        throw error;
      }
    },
  },
});
