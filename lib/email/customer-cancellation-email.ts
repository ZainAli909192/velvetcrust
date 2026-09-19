import {
  OrderEmailData,
} from "./order-email-types";

import {
  buildItemsHtml,
  escapeHtml,
  formatCancellationDate,
  getFromEmail,
  getResend,
  money,
  paymentLabel,
} from "./order-email-utils";

export async function sendCustomerCancellationEmail(
  order: OrderEmailData
) {
  const resend =
    getResend();

  const from =
    getFromEmail();

  const itemsHtml =
    buildItemsHtml(
      order.items
    );

  const cancelledAt =
    formatCancellationDate(
      order.cancelledAt
    );

  const html = `
    <!doctype html>

    <html>
      <body
        style="
          margin:0;
          padding:0;
          background:#fff8f3;
          font-family:Arial,sans-serif;
          color:#3e2926;
        "
      >
        <div
          style="
            max-width:620px;
            margin:0 auto;
            padding:40px 20px;
          "
        >
          <div
            style="
              background:#ffffff;
              border:1px solid #eaded8;
              border-radius:24px;
              padding:32px;
            "
          >
            <div
              style="
                font-size:12px;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
                color:#861417;
              "
            >
              Velvet Crust
            </div>

            <h1
              style="
                margin:14px 0 8px;
                color:#510000;
                font-size:30px;
              "
            >
              Your order has been cancelled.
            </h1>

            <p
              style="
                margin:0;
                color:#765e59;
                line-height:1.7;
              "
            >
              Hi ${escapeHtml(
                order.customerDetails
                  .fullName
              )},
              your Velvet Crust order
              has been cancelled.
            </p>

            <div
              style="
                margin-top:24px;
                padding:18px;
                border-radius:16px;
                background:#fff3ed;
              "
            >
              <div
                style="
                  font-size:12px;
                  color:#765e59;
                "
              >
                ORDER NUMBER
              </div>

              <div
                style="
                  margin-top:5px;
                  font-size:20px;
                  font-weight:700;
                  color:#510000;
                "
              >
                ${escapeHtml(
                  order.orderNumber
                )}
              </div>

              <div
                style="
                  margin-top:12px;
                  font-size:13px;
                  color:#765e59;
                "
              >
                Cancelled:
                ${escapeHtml(
                  cancelledAt
                )}
              </div>
            </div>

            <h2
              style="
                margin-top:30px;
                color:#510000;
                font-size:20px;
              "
            >
              Cancelled order
            </h2>

            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
            >
              ${itemsHtml}
            </table>

            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                margin-top:20px;
              "
            >
              <tr>
                <td
                  style="
                    padding:6px 0;
                    color:#765e59;
                  "
                >
                  Subtotal
                </td>

                <td
                  align="right"
                  style="
                    padding:6px 0;
                  "
                >
                  ${money(
                    order.subtotal
                  )}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding:6px 0;
                    color:#765e59;
                  "
                >
                  Delivery
                </td>

                <td
                  align="right"
                  style="
                    padding:6px 0;
                  "
                >
                  ${money(
                    order.deliveryFee
                  )}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding-top:14px;
                    font-size:18px;
                    font-weight:700;
                    color:#510000;
                  "
                >
                  Total
                </td>

                <td
                  align="right"
                  style="
                    padding-top:14px;
                    font-size:18px;
                    font-weight:700;
                    color:#861417;
                  "
                >
                  ${money(
                    order.total
                  )}
                </td>
              </tr>
            </table>

            <div
              style="
                margin-top:28px;
                padding:18px;
                border-radius:16px;
                background:#f8f5f3;
                line-height:1.8;
                color:#765e59;
              "
            >
              <strong
                style="
                  color:#510000;
                "
              >
                Order status:
              </strong>

              Cancelled

              <br/>

              <strong
                style="
                  color:#510000;
                "
              >
                Payment method:
              </strong>

              ${escapeHtml(
                paymentLabel(
                  order.paymentMethod
                )
              )}

              ${
                order.paymentStatus
                  ? `
                    <br/>

                    <strong
                      style="
                        color:#510000;
                      "
                    >
                      Payment status:
                    </strong>

                    ${escapeHtml(
                      order.paymentStatus
                    )}
                  `
                  : ""
              }
            </div>

            ${
              order.paymentStatus ===
              "Paid"
                ? `
                  <div
                    style="
                      margin-top:20px;
                      padding:18px;
                      border-radius:16px;
                      background:#fff3ed;
                      color:#765e59;
                      line-height:1.7;
                    "
                  >
                    This order was already
                    paid. Any applicable
                    refund will be handled
                    according to the
                    cancellation and refund
                    process.
                  </div>
                `
                : ""
            }

            <p
              style="
                margin-top:28px;
                margin-bottom:0;
                color:#765e59;
                line-height:1.7;
              "
            >
              If you did not request this
              cancellation or need help,
              please contact Velvet Crust.
            </p>

            <div
              style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid #eaded8;
                font-size:12px;
                color:#9b8580;
                line-height:1.7;
              "
            >
              Velvet Crust
              <br/>
              Homemade artisan cheesecakes
              in the UAE.
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return await resend.emails.send({
    from,

    to:
      order.customerDetails
        .email,

    subject:
      `Order cancelled · ${order.orderNumber}`,

    html,
  });
}