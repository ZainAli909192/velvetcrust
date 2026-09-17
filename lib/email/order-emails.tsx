import { Resend } from "resend";

type OrderEmailItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
};

type OrderEmailData = {
  orderNumber: string;

  customerDetails: {
    fullName: string;
    email: string;
    phone: string;
  };

  deliveryAddress: {
    emirate: string;
    area: string;
    addressLine: string;
    building?: string;
    apartment?: string;
    notes?: string;
  };

  items: OrderEmailItem[];

  subtotal: number;
  deliveryFee: number;
  total: number;

  paymentMethod: string;
};

function escapeHtml(
  value: string
) {
  return value
    .replace(
      /&/g,
      "&amp;"
    )
    .replace(
      /</g,
      "&lt;"
    )
    .replace(
      />/g,
      "&gt;"
    )
    .replace(
      /"/g,
      "&quot;"
    )
    .replace(
      /'/g,
      "&#039;"
    );
}

function money(
  value: number
) {
  return `AED ${value.toFixed(
    2
  )}`;
}

function paymentLabel(
  method: string
) {
  switch (method) {
    case "card":
      return "Credit / Debit Card";

    case "tabby":
      return "Tabby";

    case "tamara":
      return "Tamara";

    default:
      return method;
  }
}

function buildItemsHtml(
  items: OrderEmailItem[]
) {
  return items
    .map(
      (item) => `
        <tr>
          <td
            style="
              padding:12px 0;
              border-bottom:1px solid #eaded8;
            "
          >
            <div
              style="
                font-weight:600;
                color:#510000;
              "
            >
              ${escapeHtml(
                item.name
              )}
            </div>

            <div
              style="
                margin-top:4px;
                font-size:13px;
                color:#765e59;
              "
            >
              Qty ${item.quantity}
              ×
              ${money(
                item.unitPrice
              )}
            </div>
          </td>

          <td
            align="right"
            style="
              padding:12px 0;
              border-bottom:1px solid #eaded8;
              font-weight:600;
              color:#510000;
            "
          >
            ${money(
              item.totalPrice
            )}
          </td>
        </tr>
      `
    )
    .join("");
}

function getResend() {
  const apiKey =
    process.env.RESEND_API_KEY;

  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not configured."
    );
  }

  return new Resend(
    apiKey
  );
}

function getFromEmail() {
  const from =
    process.env.RESEND_FROM_EMAIL;

  if (!from) {
    throw new Error(
      "RESEND_FROM_EMAIL is not configured."
    );
  }

  return from;
}

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
                order
                  .customerDetails
                  .fullName
              )},
              thank you for ordering
              from Velvet Crust.
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
              "
            >
              <div
                style="
                  font-weight:700;
                  color:#510000;
                "
              >
                Delivery
              </div>

              <div
                style="
                  margin-top:8px;
                  color:#765e59;
                  line-height:1.7;
                "
              >
                ${escapeHtml(
                  order
                    .deliveryAddress
                    .addressLine
                )}<br/>

                ${escapeHtml(
                  order
                    .deliveryAddress
                    .area
                )},
                ${escapeHtml(
                  order
                    .deliveryAddress
                    .emirate
                )}
              </div>
            </div>

            <p
              style="
                margin-top:24px;
                font-size:13px;
                line-height:1.7;
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

            <p
              style="
                margin-top:30px;
                color:#765e59;
                line-height:1.7;
              "
            >
              We&apos;ll keep you updated
              as your order progresses.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  return await resend.emails.send({
    from,

    to:
      order.customerDetails.email,

    subject:
      `Order received · ${order.orderNumber}`,

    html,
  });
}

export async function sendOwnerOrderEmail(
  order: OrderEmailData
) {
  const ownerEmail =
    process.env.OWNER_EMAIL;

  if (!ownerEmail) {
    throw new Error(
      "OWNER_EMAIL is not configured."
    );
  }

  const resend =
    getResend();

  const from =
    getFromEmail();

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
              placed on the website.
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
              style="
                line-height:1.8;
              "
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
              style="
                line-height:1.8;
              "
            >
              <strong>Emirate:</strong>
              ${escapeHtml(
                deliveryAddress.emirate
              )}
              <br/>

              <strong>Area:</strong>
              ${escapeHtml(
                deliveryAddress.area
              )}
              <br/>

              <strong>Address:</strong>
              ${escapeHtml(
                deliveryAddress.addressLine
              )}
              <br/>

              ${
                deliveryAddress.building
                  ? `
                    <strong>
                      Building / Villa:
                    </strong>
                    ${escapeHtml(
                      deliveryAddress.building
                    )}
                    <br/>
                  `
                  : ""
              }

              ${
                deliveryAddress.apartment
                  ? `
                    <strong>
                      Apartment / Unit:
                    </strong>
                    ${escapeHtml(
                      deliveryAddress.apartment
                    )}
                    <br/>
                  `
                  : ""
              }

              ${
                deliveryAddress.notes
                  ? `
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

            <table
              width="100%"
              cellspacing="0"
              cellpadding="0"
              style="
                margin-top:22px;
              "
            >
              <tr>
                <td>
                  Subtotal
                </td>

                <td align="right">
                  ${money(
                    order.subtotal
                  )}
                </td>
              </tr>

              <tr>
                <td
                  style="
                    padding-top:8px;
                  "
                >
                  Delivery
                </td>

                <td
                  align="right"
                  style="
                    padding-top:8px;
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
                Order status:
              </strong>
              Pending
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

export async function sendOrderCreatedEmails(
  order: OrderEmailData
) {
  const results =
    await Promise.allSettled([
      sendCustomerOrderEmail(
        order
      ),

      sendOwnerOrderEmail(
        order
      ),
    ]);

  const [
    customerResult,
    ownerResult,
  ] = results;

  if (
    customerResult.status ===
    "rejected"
  ) {
    console.error(
      "Customer order email failed:",
      customerResult.reason
    );
  }

  if (
    ownerResult.status ===
    "rejected"
  ) {
    console.error(
      "Owner order email failed:",
      ownerResult.reason
    );
  }

  return {
    customerSent:
      customerResult.status ===
      "fulfilled",

    ownerSent:
      ownerResult.status ===
      "fulfilled",
  };
}