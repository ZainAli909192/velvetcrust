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

export async function sendCustomerOrderConfirmedEmail(
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
              Your order is confirmed.
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
              your payment was successful
              and your Velvet Crust order
              is now confirmed.
            </p>

            <div
              style="
                margin-top:24px;
                padding:18px;
                border-radius:16px;
                background:#edf8ef;
              "
            >
              <div
                style="
                  font-size:12px;
                  font-weight:700;
                  color:#28733b;
                "
              >
                PAYMENT SUCCESSFUL
              </div>

              <div
                style="
                  margin-top:7px;
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
                  margin-top:7px;
                  color:#28733b;
                  font-size:14px;
                "
              >
                ${money(
                  order.total
                )} paid
              </div>
            </div>

            <h2
              style="
                margin-top:30px;
                color:#510000;
                font-size:20px;
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
                  Paid total
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

            <div
              style="
                margin-top:24px;
                padding:18px;
                border-radius:16px;
                background:#fff3ed;
                line-height:1.8;
                color:#765e59;
              "
            >
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

              <br/>

              <strong
                style="
                  color:#510000;
                "
              >
                Payment status:
              </strong>

              Paid

              <br/>

              <strong
                style="
                  color:#510000;
                "
              >
                Order status:
              </strong>

              Confirmed
            </div>

            <p
              style="
                margin-top:28px;
                color:#765e59;
                line-height:1.7;
              "
            >
              We're now preparing your
              Velvet Crust order and will
              keep you updated.
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
      `Order confirmed · ${order.orderNumber}`,

    html,
  });
}