import {
  OrderEmailData,
} from "./order-email-types";

import {
  buildDeliveryHtml,
  buildItemsHtml,
  escapeHtml,
  getFromEmail,
  getOwnerEmail,
  getResend,
  money,
  paymentLabel,
} from "./order-email-utils";

export async function sendOwnerOrderConfirmedEmail(
  order: OrderEmailData
) {
  const resend =
    getResend();

  const from =
    getFromEmail();

  const ownerEmail =
    getOwnerEmail();

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
          background:#f7f7f7;
          font-family:Arial,sans-serif;
          color:#292929;
        "
      >
        <div
          style="
            max-width:680px;
            margin:0 auto;
            padding:40px 20px;
          "
        >
          <div
            style="
              background:#ffffff;
              border:1px solid #e9e9e9;
              border-radius:20px;
              padding:32px;
            "
          >
            <div
              style="
                font-size:12px;
                font-weight:700;
                letter-spacing:2px;
                text-transform:uppercase;
                color:#28733b;
              "
            >
              Payment Confirmed
            </div>

            <h1
              style="
                margin:12px 0;
                color:#510000;
              "
            >
              ${escapeHtml(
                order.orderNumber
              )}
            </h1>

            <div
              style="
                padding:18px;
                background:#edf8ef;
                border-radius:14px;
                color:#28733b;
                line-height:1.8;
              "
            >
              <strong>
                Payment received:
              </strong>

              ${money(
                order.total
              )}

              <br/>

              <strong>
                Order status:
              </strong>

              Confirmed
            </div>

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Customer
            </h2>

            <p
              style="line-height:1.8;"
            >
              <strong>
                Name:
              </strong>

              ${escapeHtml(
                order.customerDetails
                  .fullName
              )}

              <br/>

              <strong>
                Email:
              </strong>

              ${escapeHtml(
                order.customerDetails
                  .email
              )}

              <br/>

              <strong>
                Phone:
              </strong>

              ${escapeHtml(
                order.customerDetails
                  .phone
              )}
            </p>

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Items
            </h2>

            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
            >
              ${itemsHtml}
            </table>

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Delivery
            </h2>

            <div
              style="
                line-height:1.8;
              "
            >
              ${buildDeliveryHtml(
                order
              )}
            </div>

            ${
              order.deliveryAddress
                .notes
                ? `
                  <p>
                    <strong>
                      Notes:
                    </strong>

                    ${escapeHtml(
                      order
                        .deliveryAddress
                        .notes
                    )}
                  </p>
                `
                : ""
            }

            <div
              style="
                margin-top:28px;
                padding:18px;
                background:#fff3ed;
                border-radius:14px;
                line-height:1.8;
              "
            >
              <strong>
                Payment method:
              </strong>

              ${escapeHtml(
                paymentLabel(
                  order.paymentMethod
                )
              )}

              <br/>

              <strong>
                Payment status:
              </strong>

              Paid

              <br/>

              <strong>
                Total:
              </strong>

              ${money(
                order.total
              )}
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  return await resend.emails.send({
    from,

    to:
      ownerEmail,

    subject:
      `Paid order ${order.orderNumber} · ${money(
        order.total
      )}`,

    html,
  });
}