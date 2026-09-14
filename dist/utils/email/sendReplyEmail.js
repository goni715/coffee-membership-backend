"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const config_1 = __importDefault(require("../../config"));
const sendReplyEmail = async (email, replyMessage) => {
    // transporter
    const transporter = nodemailer_1.default.createTransport({
        host: "smtp.gmail.com",
        port: config_1.default.node_env === "production" ? 465 : 587,
        secure: config_1.default.node_env === "production" ? true : false,
        auth: {
            user: config_1.default.smtp.smtp_username,
            pass: config_1.default.smtp.smtp_password,
        },
        tls: {
            rejectUnauthorized: config_1.default.node_env === "production",
        },
    });
    const mailOptions = {
        from: `Heritage & Hearth ${config_1.default.smtp.smtp_from}`,
        to: email,
        subject: "Response to Your Inquiry - Heritage & Hearth",
        text: `Thank you for reaching out to us. We have received your message and our support team has responded:\n\n${replyMessage}\n\nIf you have any further questions, simply reply to this email or contact our support team at support@heritageandhearth.com.\n\n© ${new Date().getFullYear()} Heritage & Hearth. All rights reserved.`,
        html: `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>Response to Your Inquiry</title>
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
            <td height="4" style="background-color:#10b981; font-size:0; line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td align="center" style="padding:36px 40px 24px;">
              <p style="margin:0; font-size:20px; font-weight:bold; color:#047857; letter-spacing:0.5px;">HERITAGE &amp; HEARTH</p>
              <p style="margin:6px 0 0; font-size:12px; color:#64748b; letter-spacing:1px; text-transform:uppercase;">Customer Support Reply</p>
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
                Thank you for reaching out to us. We have received your message and our support team has responded to your inquiry:
              </p>

              <!-- Reply Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:28px;">
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="background-color:#f0fdf4; border-left:4px solid #10b981; border-radius:0 6px 6px 0; padding:20px;">
                          <p style="margin:0; font-size:15px; color:#064e3b; line-height:1.6; white-space:pre-wrap;">${replyMessage}</p>
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
                If you have any further questions, simply reply to this email or contact our support team.
              </p>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc; border-top:1px solid #e2e8f0; padding:20px 40px; text-align:center;">
              <p style="margin:0 0 4px; font-size:12px; color:#64748b;">
                Questions? Contact us at
                <a href="mailto:support@heritageandhearth.com" style="color:#10b981; text-decoration:none;">support@heritageandhearth.com</a>
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
exports.default = sendReplyEmail;
