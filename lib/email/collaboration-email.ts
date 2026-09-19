import { Resend } from "resend";

const resend = new Resend(
  process.env.RESEND_API_KEY,
);

type CollaborationEmailInput = {
  name: string;
  email: string;
  phone: string;
  type: string;
  message: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function sendCollaborationEmail({
  name,
  email,
  phone,
  type,
  message,
}: CollaborationEmailInput) {
  const ownerEmail = process.env.OWNER_EMAIL;
  const fromEmail = process.env.RESEND_FROM_EMAIL;

  if (!ownerEmail) {
    throw new Error(
      "OWNER_EMAIL is not defined.",
    );
  }

  if (!fromEmail) {
    throw new Error(
      "RESEND_FROM_EMAIL is not defined.",
    );
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = escapeHtml(phone);
  const safeType = escapeHtml(type);
  const safeMessage = escapeHtml(message);

  const result = await resend.emails.send({
    from: fromEmail,
    to: ownerEmail,

    replyTo: email,

    subject: `New Collaboration Enquiry — ${type}`,

    html: `
      <div
        style="
          margin:0;
          padding:32px;
          background:#FFF9F2;
          font-family:Arial,sans-serif;
          color:#432B28;
        "
      >
        <div
          style="
            max-width:620px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid rgba(81,0,0,0.10);
            border-radius:20px;
            overflow:hidden;
          "
        >
          <div
            style="
              background:#510000;
              padding:28px 30px;
              color:#ffffff;
            "
          >
            <div
              style="
                font-size:12px;
                letter-spacing:2px;
                text-transform:uppercase;
                opacity:0.75;
              "
            >
              Velvet Crust
            </div>

            <h1
              style="
                margin:8px 0 0;
                font-size:25px;
                font-weight:500;
              "
            >
              New Collaboration Enquiry
            </h1>
          </div>

          <div style="padding:30px;">
            <p
              style="
                margin:0 0 24px;
                color:#765E59;
                line-height:1.6;
              "
            >
              A new collaboration enquiry has been
              submitted through the Velvet Crust website.
            </p>

            <table
              width="100%"
              cellpadding="0"
              cellspacing="0"
              style="
                border-collapse:collapse;
                font-size:14px;
              "
            >
              <tr>
                <td
                  style="
                    padding:12px 0;
                    color:#8B5550;
                    width:150px;
                    vertical-align:top;
                  "
                >
                  Name
                </td>

                <td
                  style="
                    padding:12px 0;
                    font-weight:600;
                  "
                >
                  ${safeName}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:12px 0;
                    color:#8B5550;
                    vertical-align:top;
                  "
                >
                  Email
                </td>

                <td style="padding:12px 0;">
                  ${safeEmail}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:12px 0;
                    color:#8B5550;
                    vertical-align:top;
                  "
                >
                  Phone / WhatsApp
                </td>

                <td style="padding:12px 0;">
                  ${safePhone}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:12px 0;
                    color:#8B5550;
                    vertical-align:top;
                  "
                >
                  Collaboration Type
                </td>

                <td style="padding:12px 0;">
                  ${safeType}
                </td>
              </tr>
            </table>

            <div
              style="
                margin-top:24px;
                padding:20px;
                background:#FFF9F2;
                border-radius:14px;
              "
            >
              <div
                style="
                  margin-bottom:10px;
                  color:#8B5550;
                  font-size:12px;
                  font-weight:600;
                  text-transform:uppercase;
                  letter-spacing:1px;
                "
              >
                Collaboration Idea
              </div>

              <div
                style="
                  white-space:pre-wrap;
                  line-height:1.7;
                  font-size:14px;
                "
              >${safeMessage}</div>
            </div>

            <p
              style="
                margin:25px 0 0;
                color:#765E59;
                font-size:12px;
                line-height:1.6;
              "
            >
              You can reply directly to this email to
              contact ${safeName}.
            </p>
          </div>
        </div>
      </div>
    `,
  });

  if (result.error) {
    throw new Error(
      result.error.message ||
        "Unable to send collaboration email.",
    );
  }

  return result.data;
}