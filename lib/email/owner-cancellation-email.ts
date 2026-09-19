import {
  OrderEmailData,
} from "./order-email-types";

import {
  buildItemsHtml,
  escapeHtml,
  formatCancellationDate,
  getFromEmail,
  getOwnerEmail,
  getResend,
  money,
  paymentLabel,
} from "./order-email-utils";

export async function sendOwnerCancellationEmail(
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

  const cancelledAt =
    formatCancellationDate(
      order.cancelledAt
    );

  const {
    customerDetails,
    deliveryAddress,
  } = order;

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
                color:#861417;
              "
            >
              Order Cancelled
            </div>

            <h1
              style="
                margin:12px 0 8px;
                color:#510000;
              "
            >
              ${escapeHtml(
                order.orderNumber
              )}
            </h1>

            <p
              style="
                margin:0;
                color:#666666;
                line-height:1.7;
              "
            >
              A Velvet Crust order
              has been cancelled.
            </p>

            <div
              style="
                margin-top:24px;
                padding:18px;
                border-radius:14px;
                background:#fff3ed;
              "
            >
              <strong
                style="
                  color:#510000;
                "
              >
                Cancelled:
              </strong>

              ${escapeHtml(
                cancelledAt
              )}

              <br/>

              <strong
                style="
                  color:#510000;
                "
              >
                Order status:
              </strong>

              Cancelled
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
              style="
                line-height:1.8;
              "
            >
              <strong>
                Name:
              </strong>

              ${escapeHtml(
                customerDetails
                  .fullName
              )}

              <br/>

              <strong>
                Email:
              </strong>

              ${escapeHtml(
                customerDetails
                  .email
              )}

              <br/>

              <strong>
                Phone:
              </strong>

              ${escapeHtml(
                customerDetails
                  .phone
              )}
            </p>

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Cancelled items
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
                    color:#666666;
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
                    color:#666666;
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

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Delivery
            </h2>

            <p
              style="
                line-height:1.8;
              "
            >
              <strong>
                Emirate:
              </strong>

              ${escapeHtml(
                deliveryAddress
                  .emirate
              )}

              <br/>

              <strong>
                Area:
              </strong>

              ${escapeHtml(
                deliveryAddress
                  .area
              )}

              <br/>

              <strong>
                Address:
              </strong>

              ${escapeHtml(
                deliveryAddress
                  .addressLine
              )}

              ${
                deliveryAddress
                  .building
                  ? `
                    <br/>

                    <strong>
                      Building / Villa:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress
                        .building
                    )}
                  `
                  : ""
              }

              ${
                deliveryAddress
                  .apartment
                  ? `
                    <br/>

                    <strong>
                      Apartment / Unit:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress
                        .apartment
                    )}
                  `
                  : ""
              }

              ${
                deliveryAddress
                  .notes
                  ? `
                    <br/>

                    <strong>
                      Notes:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress
                        .notes
                    )}
                  `
                  : ""
              }
            </p>

            <div
              style="
                margin-top:28px;
                padding:18px;
                border-radius:14px;
                background:#f8f5f3;
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

              ${
                order.paymentStatus
                  ? `
                    <br/>

                    <strong>
                      Payment status:
                    </strong>

                    ${escapeHtml(
                      order.paymentStatus
                    )}
                  `
                  : ""
              }

              <br/>

              <strong>
                Order status:
              </strong>

              Cancelled
            </div>

            ${
              order.paymentStatus ===
              "Paid"
                ? `
                  <div
                    style="
                      margin-top:20px;
                      padding:18px;
                      border-radius:14px;
                      background:#fff3ed;
                      color:#861417;
                      line-height:1.7;
                    "
                  >
                    <strong>
                      Attention:
                    </strong>

                    This order was paid
                    before cancellation.
                    Check the payment and
                    refund status before
                    closing the order.
                  </div>
                `
                : ""
            }

            <div
              style="
                margin-top:30px;
                padding-top:20px;
                border-top:1px solid #e9e9e9;
                font-size:12px;
                color:#888888;
              "
            >
              Velvet Crust
              <br/>
              Order cancellation notification
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

    replyTo:
      customerDetails.email,

    subject:
      `Order cancelled · ${order.orderNumber}`,

    html,
  });
}