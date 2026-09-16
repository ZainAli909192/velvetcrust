import { resend } from "./resend";

type SendPasswordResetOtpParams = {
  email: string;
  name: string;
  otp: string;
};

export async function sendPasswordResetOtp({
  email,
  name,
  otp,
}: SendPasswordResetOtpParams) {
  const from =
    process.env.EMAIL_FROM;

  if (!from) {
    throw new Error(
      "EMAIL_FROM is not configured."
    );
  }

  const { error } =
    await resend.emails.send({
      from,
      to: email,
      subject:
        "Your Velvet Crust verification code",
      html: `
        <div style="
          margin:0;
          padding:40px 20px;
          background:#FFF8EF;
          font-family:Arial,sans-serif;
          color:#321716;
        ">
          <div style="
            max-width:520px;
            margin:0 auto;
            background:#ffffff;
            border:1px solid #EED8CC;
            border-radius:24px;
            padding:40px;
          ">
            <p style="
              margin:0 0 12px;
              color:#7A1F24;
              font-size:12px;
              font-weight:700;
              letter-spacing:2px;
              text-transform:uppercase;
            ">
              Velvet Crust
            </p>

            <h1 style="
              margin:0;
              font-family:Georgia,serif;
              font-size:30px;
              font-weight:500;
              color:#321716;
            ">
              Reset your password
            </h1>

            <p style="
              margin:22px 0 0;
              color:#765E59;
              font-size:15px;
              line-height:1.7;
            ">
              Hi ${escapeHtml(name)}, use the verification code below to continue resetting your password.
            </p>

            <div style="
              margin:28px 0;
              padding:22px;
              border-radius:18px;
              background:#F8ECE7;
              text-align:center;
            ">
              <span style="
                color:#721C20;
                font-size:34px;
                font-weight:700;
                letter-spacing:10px;
              ">
                ${otp}
              </span>
            </div>

            <p style="
              margin:0;
              color:#765E59;
              font-size:13px;
              line-height:1.7;
            ">
              This code expires after 2 minutes. If you did not request a password reset, you can ignore this email.
            </p>
          </div>
        </div>
      `,
    });

  if (error) {
    throw new Error(
      "Unable to send password reset email."
    );
  }
}

function escapeHtml(
  value: string
) {
  return value.replace(
    /[&<>"']/g,
    (character) => {
      const entities: Record<
        string,
        string
      > = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#039;",
      };

      return entities[character];
    }
  );
}