import {
  OrderEmailData,
} from "./order-email-types";

import {
  buildDeliveryHtml,
  buildItemsHtml,
  escapeHtml,
  getFromEmail,
  getResend,
  money,
  paymentLabel,
} from "./order-email-utils";

export async function sendCustomerOrderEmail(
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
              We received your order.
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
              your order has been created.
              Complete payment to confirm it.
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
            </div>

            <h2
              style="
                margin-top:30px;
                color:#510000;
              "
            >
              Order summary
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
              style="margin-top:20px;"
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
              "
            >
              <strong
                style="
                  color:#510000;
                "
              >
                Delivery
              </strong>

              <div
                style="
                  margin-top:8px;
                  color:#765e59;
                  line-height:1.7;
                "
              >
                ${buildDeliveryHtml(
                  order
                )}
              </div>
            </div>

            <p
              style="
                margin-top:24px;
                font-size:13px;
                line-height:1.8;
                color:#765e59;
              "
            >
              Payment method:
              <strong>
                ${escapeHtml(
                  paymentLabel(
                    order.paymentMethod
                  )
                )}
              </strong>

              <br/>

              Payment status:
              <strong>
                Pending
              </strong>
            </p>
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
      `Order received · ${order.orderNumber}`,

    html,
  });
}