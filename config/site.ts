export type ApprovalState = "approved" | "client-approval-required";

export type ContactItem = {
  label: string;
  value: string;
  href: `tel:${string}` | `mailto:${string}` | null;
  approval: ApprovalState;
};

export type SocialItem = {
  label: string;
  network: "whatsapp" | "instagram" | "linkedin";
  href: `https://${string}`;
  approval: ApprovalState;
};

export type ConnectItem = {
  label: string;
  kind: "whatsapp" | "instagram" | "call" | "email" | "linkedin";
  href: string;
  external?: boolean;
  approval: ApprovalState;
};

export const siteConfig = {
  name: "InnovGen",
  legalName: "InnovGen IT Software Solutions",
  description:
    "Secure, scalable digital systems for ambitious organizations.",
} as const;

export const contactItems = [
  {
    label: "Phone",
    value: "+971 5 255 0093",
    href: "tel:+97152550093",
    approval: "approved",
  },
  {
    label: "Email",
    value: "info@innovgen.com",
    href: "mailto:info@innovgen.com",
    approval: "approved",
  },
  {
    label: "Office",
    value: "R364-AL Wasl Building, Al Karama, Dubai, PO Box 87566",
    href: null,
    approval: "approved",
  },
] as const satisfies readonly ContactItem[];

export const socialItems = [
  {
    label: "WhatsApp",
    network: "whatsapp",
    href: "https://wa.me/971563337727",
    approval: "approved",
  },
  {
    label: "Instagram",
    network: "instagram",
    href: "https://www.instagram.com/innovgen/",
    approval: "approved",
  },
  {
    label: "LinkedIn",
    network: "linkedin",
    href: "https://www.linkedin.com/company/innovgen-technology-solutions-llc/",
    approval: "approved",
  },
] as const satisfies readonly SocialItem[];

export const connectItems: readonly ConnectItem[] = [
  {
    label: "WhatsApp",
    kind: "whatsapp",
    href: "https://wa.me/971563337727",
    external: true,
    approval: "approved",
  },
  {
    label: "Instagram",
    kind: "instagram",
    href: "https://www.instagram.com/velvetcrustae/",
    external: true,
    approval: "approved",
  },
  {
    label: "Call ",
    kind: "call",
    href: "tel:+97152550093",
    approval: "approved",
  },
  {
    label: "Email ",
    kind: "email",
    href: "mailto:nayef@innovgen.com",
    approval: "approved",
  },
  // {
  //   label: "Facebook",
  //   kind: "facebook",
  //   href: "https://www.facebook.com/innovgen/",
  //   external: true,
  //   approval: "approved",
  // },
//   {
//     label: "LinkedIn",
//     kind: "linkedin",
//     href: "https://www.linkedin.com/company/innovgen-technology-solutions-llc/",
//     external: true,
//     approval: "approved",
//   },
];

export const trustItems: readonly {
  label: string;
  type: "partner" | "certification" | "client";
  approval: "approved";
}[] = [];
     