import nodemailer from "nodemailer";
import config from "@/config";

const sendForgotEmail = async (EmailTo: string, otp: string) => {
  // transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: config.node_env === "production" ? 465 : 587,
    secure: config.node_env === "production" ? true : false,
    auth: {
      user: config.smtp.smtp_username,
      pass: config.smtp.smtp_password,
    },
    tls: {
      rejectUnauthorized: config.node_env === "production",
    },
  });

  const mailOptions = {
    from: config.smtp.smtp_from,
    to: EmailTo,
    subject: "Your Heritage & Hearth Password Reset Code",
    // Plain-text fallback — critical for spam score
    text: `Your Heritage & Hearth password reset code is: ${otp}\n\nThis code expires in 10 minutes.\n\nIf you did not request this, please ignore this email.\n\n© ${new Date().getFullYear()} Heritage & Hearth`,
    html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Reset Your Password</title>
</head>
<body style="margin:0; padding:0; background-color:#f0f4f8; font-family:Arial, Helvetica, sans-serif; color:#1a202c;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f0f4f8; padding:32px 16px;">
    <tr>
      <td align="center">

        <!-- Card -->
        <table width="540" cellpadding="0" cellspacing="0" border="0"
          style="background-color:#ffffff; border-radius:8px; border:1px solid #e2e8f0; overflow:hidden;">

          <!-- Top accent bar -->
          <tr>
            <td height="4" style="background-color:#ea580c; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 24px;">
              <p style="margin:0; font-size:20px; font-weight:bold; color:#c2410c; letter-spacing:0.5px;">HERITAGE &amp; HEARTH</p>
              <p style="margin:6px 0 0; font-size:12px; color:#64748b; letter-spacing:1px; text-transform:uppercase;">Password Reset</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr><td height="1" style="background-color:#e2e8f0; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px 40px;">

              <p style="margin:0 0 12px; font-size:16px; font-weight:bold; color:#1a202c;">Hello,</p>
              <p style="margin:0 0 28px; font-size:14px; color:#4a5568; line-height:1.7;">
                We received a request to reset the password for your Heritage & Hearth account.
                Please use the code below to proceed.
                This code will expire in <strong style="color:#c2410c;">10 minutes</strong>.
              </p>

              <!-- OTP Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td align="center"
                          style="background-color:#fff7ed; border:1px solid #fed7aa; border-radius:6px; padding:20px 40px;">
                          <p style="margin:0 0 6px; font-size:11px; font-weight:bold; color:#ea580c; letter-spacing:1.5px; text-transform:uppercase;">Reset Code</p>
                          <p style="margin:0; font-size:38px; font-weight:bold; color:#9a3412; letter-spacing:10px; font-family:'Courier New', Courier, monospace;">${otp}</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Expiry note -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td align="center">
                    <table cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#fefce8; border:1px solid #fde68a; border-radius:4px; padding:8px 18px;">
                          <p style="margin:0; font-size:12px; color:#92400e;">This code expires in 10 minutes. Do not share it with anyone.</p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
                <tr><td height="1" style="background-color:#e2e8f0; font-size:0; line-height:0;">&nbsp;</td></tr>
              </table>

              <!-- Security note -->
              <p style="margin:0; font-size:12px; color:#94a3b8; line-height:1.6;">
                If you did not request a password reset, you can safely ignore this email.
                Your password will not be changed and your account remains secure.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
              <p style="margin:0 0 4px; font-size:12px; color:#64748b;">
                Questions? Contact us at
                <a href="mailto:support@heritageandhearth.com" style="color:#ea580c; text-decoration:none;">support@heritageandhearth.com</a>
              </p>
              <p style="margin:0; font-size:11px; color:#94a3b8;">
                &copy; ${new Date().getFullYear()} Heritage & Hearth. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
        <!-- /Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `,
  };

  return await transporter.sendMail(mailOptions);
};

export default sendForgotEmail;
