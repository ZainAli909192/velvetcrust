import {
  OrderEmailData,
} from "./order-email-types";

import {
  buildItemsHtml,
  escapeHtml,
  getFromEmail,
  getOwnerEmail,
  getResend,
  money,
  paymentLabel,
} from "./order-email-utils";

export async function sendOwnerOrderEmail(
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
              border-radius:20px;
              padding:32px;
              border:1px solid #e9e9e9;
            "
          >
            <div
              style="
                font-size:12px;
                font-weight:700;
                letter-spacing:2px;
                color:#861417;
                text-transform:uppercase;
              "
            >
              New Velvet Crust Order
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

            <p>
              A new order has been
              created and is awaiting
              payment.
            </p>

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
              <strong>Name:</strong>
              ${escapeHtml(
                customerDetails.fullName
              )}

              <br/>

              <strong>Email:</strong>
              ${escapeHtml(
                customerDetails.email
              )}

              <br/>

              <strong>Phone:</strong>
              ${escapeHtml(
                customerDetails.phone
              )}
            </p>

            <h2
              style="
                margin-top:28px;
                color:#510000;
              "
            >
              Delivery
            </h2>

            <p
              style="line-height:1.8;"
            >
              <strong>
                Emirate:
              </strong>

              ${escapeHtml(
                deliveryAddress.emirate
              )}

              <br/>

              <strong>
                Area:
              </strong>

              ${escapeHtml(
                deliveryAddress.area
              )}

              <br/>

              <strong>
                Address:
              </strong>

              ${escapeHtml(
                deliveryAddress.addressLine
              )}

              ${
                deliveryAddress.building
                  ? `
                    <br/>

                    <strong>
                      Building / Villa:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress.building
                    )}
                  `
                  : ""
              }

              ${
                deliveryAddress.apartment
                  ? `
                    <br/>

                    <strong>
                      Apartment / Unit:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress.apartment
                    )}
                  `
                  : ""
              }

              ${
                deliveryAddress.notes
                  ? `
                    <br/>

                    <strong>
                      Notes:
                    </strong>

                    ${escapeHtml(
                      deliveryAddress.notes
                    )}
                  `
                  : ""
              }
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

              Pending

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
      `New order ${order.orderNumber} · ${money(
        order.total
      )}`,

    html,
  });
}