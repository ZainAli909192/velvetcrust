import Link from "next/link";
import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "light";

type ButtonSize =
  | "sm"
  | "md"
  | "lg"
  | "icon";

type CommonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

type LinkButtonProps = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
};

type NativeButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: never;
  };

type ButtonProps = LinkButtonProps | NativeButtonProps;

const variantClasses: Record<ButtonVariant, string> = {
  primary: `
    bg-[var(--brand-primary)]
    text-white
    hover:bg-[var(--brand-primary-dark)]
  `,

  secondary: `
    bg-[var(--brand-primary-soft)]
    text-[var(--brand-primary)]
    hover:bg-[var(--brand-cream-dark)]
  `,

  outline: `
    border
    border-[var(--brand-primary)]
    bg-transparent
    text-[var(--brand-primary)]
    hover:bg-[var(--brand-primary)]
    hover:text-white
  `,

  ghost: `
    bg-transparent
    text-[var(--brand-primary)]
    hover:bg-[var(--brand-primary-soft)]
  `,

  light: `
    bg-[var(--brand-background)]
    text-[var(--brand-primary)]
    hover:bg-white
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-4 py-2 text-[10px]",
  md: "px-6 py-3 text-xs",
  lg: "px-8 py-4 text-sm",
  icon: "h-10 w-10 p-0",
};

const baseClasses = `
  inline-flex
  items-center
  justify-center
  gap-2
  rounded-full
  font-semibold
  uppercase
  tracking-[0.12em]
  transition-all
  duration-300

  hover:-translate-y-0.5

  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-[var(--brand-primary)]
  focus-visible:ring-offset-2

  disabled:pointer-events-none
  disabled:opacity-50
`;

export default function Button({
  children,
  variant = "primary",
  size = "md",
  iconLeft,
  iconRight,
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${fullWidth ? "w-full" : ""}
    ${className}
  `;

  if ("href" in props && props.href) {
    return (
      <Link
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes}
      >
        {iconLeft}
        {children}
        {iconRight}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={classes}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  );
}