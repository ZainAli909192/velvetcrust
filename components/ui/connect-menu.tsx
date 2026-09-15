"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Download,
  FileText,
  Mail,
  Phone,
  Share2,
  X,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import { contactDetails } from "@/lib/contact";

type ConnectKind =
  | "whatsapp"
  | "instagram"
  | "call"
  | "email";

type ConnectItem = {
  label: string;
  kind: ConnectKind;
  href: string;
  external?: boolean;
};

const connectItems: ConnectItem[] = [
  {
    label: "WhatsApp",
    kind: "whatsapp",
    href: contactDetails.whatsapp.href,
    external: true,
  },
  {
    label: "Instagram",
    kind: "instagram",
    href: contactDetails.instagram.href,
    external: true,
  },
  {
    label: "Call",
    kind: "call",
    href: contactDetails.phone.href,
  },
  {
    label: "Email",
    kind: "email",
    href: contactDetails.email.href,
  },
];

const menuVariants = {
  closed: {
    opacity: 0,
    y: 16,
    scale: 0.96,
    transition: {
      duration: 0.18,
      when: "afterChildren" as const,
      staggerChildren: 0.025,
      staggerDirection: -1,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      stiffness: 360,
      damping: 28,
      staggerChildren: 0.045,
      delayChildren: 0.03,
    },
  },
};

const itemVariants = {
  closed: {
    opacity: 0,
    x: 10,
    y: 4,
  },
  open: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: {
      type: "spring" as const,
      stiffness: 420,
      damping: 27,
    },
  },
};

function ConnectIcon({
  kind,
}: {
  kind: ConnectKind;
}) {
  if (kind === "call") {
    return (
      <Phone
        className="size-[18px]"
        strokeWidth={1.8}
      />
    );
  }

  if (kind === "email") {
    return (
      <Mail
        className="size-[18px]"
        strokeWidth={1.8}
      />
    );
  }

  const paths = {
    whatsapp:
      "M16.75 13.96c-.26-.13-1.54-.76-1.78-.85-.24-.09-.41-.13-.59.13-.17.26-.67.85-.82 1.02-.15.17-.3.2-.56.07-.26-.13-1.09-.4-2.07-1.28-.77-.68-1.29-1.52-1.44-1.78-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.46.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.07-.13-.59-1.41-.8-1.93-.21-.51-.43-.44-.59-.45h-.5c-.17 0-.46.07-.7.33-.24.26-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.17 1.83 2.8 4.44 3.92.62.27 1.1.43 1.48.55.62.2 1.19.17 1.63.1.5-.07 1.54-.63 1.76-1.24.22-.61.22-1.13.15-1.24-.06-.11-.24-.17-.5-.3M12.04 21a8.93 8.93 0 0 1-4.55-1.25L2.45 21l1.35-4.91A8.93 8.93 0 1 1 12.04 21m0-16.2a7.25 7.25 0 0 0-6.16 11.08l.2.31-.8 2.92 3-.79.29.17a7.26 7.26 0 1 0 3.47-13.69",

    instagram:
      "M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7m10.5 1.5A1.25 1.25 0 1 1 16.25 6.75 1.25 1.25 0 0 1 17.5 5.5M12 7a5 5 0 1 1-5 5 5 5 0 0 1 5-5m0 2a3 3 0 1 0 3 3 3 3 0 0 0-3-3",
  };

  return (
    <svg
      aria-hidden="true"
      className="size-[18px]"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d={paths[kind]} />
    </svg>
  );
}

export function ConnectMenu() {
  const [open, setOpen] = useState(false);
  const [downloading, setDownloading] =
    useState(false);
  const [downloadSuccess, setDownloadSuccess] =
    useState(false);
  const [downloadError, setDownloadError] =
    useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef =
    useRef<HTMLDivElement>(null);
  const triggerRef =
    useRef<HTMLButtonElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(
      event: PointerEvent
    ) {
      if (
        !containerRef.current?.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key !== "Escape") return;

      setOpen(false);
      triggerRef.current?.focus();
    }

    document.addEventListener(
      "pointerdown",
      handlePointerDown
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "pointerdown",
        handlePointerDown
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [open]);

  async function downloadCompanyProfile() {
    if (downloading) return;

    setOpen(false);
    setDownloading(true);
    setDownloadSuccess(false);
    setDownloadError(false);
    setProgress(12);

    let progressTimer: ReturnType<
      typeof setInterval
    > | null = null;

    try {
      progressTimer = setInterval(() => {
        setProgress((current) => {
          if (current >= 85) return current;

          return Math.min(
            current + Math.floor(Math.random() * 8) + 3,
            85
          );
        });
      }, 180);

      const response = await fetch(
        "/companyprofile.pdf"
      );

      if (!response.ok) {
        throw new Error(
          "Unable to download company profile."
        );
      }

      const blob = await response.blob();

      if (progressTimer) {
        clearInterval(progressTimer);
      }

      setProgress(100);

      const url = URL.createObjectURL(blob);
      const anchor =
        document.createElement("a");

      anchor.href = url;
      anchor.download =
        "Velvet-Crust-Company-Profile.pdf";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setTimeout(() => {
        setDownloading(false);
        setDownloadSuccess(true);
      }, 450);

      setTimeout(() => {
        setDownloadSuccess(false);
      }, 3800);
    } catch (error) {
      if (progressTimer) {
        clearInterval(progressTimer);
      }

      console.error(error);

      setDownloading(false);
      setProgress(0);
      setDownloadError(true);

      setTimeout(() => {
        setDownloadError(false);
      }, 4000);
    }
  }

  return (
    <>
      <div
        ref={containerRef}
        className="
          fixed
              bottom-[calc(7.5rem+env(safe-area-inset-bottom))]

    lg:bottom-[10%]
          right-4
          z-[75]
          flex
          flex-col
          items-end
          gap-3
          sm:right-6
          lg:right-8
        "
      >
        {/* Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="connect-actions"
              role="group"
              aria-label="Connect with Velvet Crust"
              variants={
                reducedMotion
                  ? undefined
                  : menuVariants
              }
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : "closed"
              }
              animate={
                reducedMotion
                  ? { opacity: 1 }
                  : "open"
              }
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : "closed"
              }
              className="
                origin-bottom-right
                rounded-[22px]
                border
                border-[var(--brand-border)]
                bg-[var(--brand-background)]/95
                p-2
                shadow-[0_20px_60px_rgba(81,0,0,0.18)]
                backdrop-blur-xl
              "
            >
              {connectItems.map((item) => (
                <motion.a
                  key={item.kind}
                  href={item.href}
                  target={
                    item.external
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    item.external
                      ? "noopener noreferrer"
                      : undefined
                  }
                  onClick={() => setOpen(false)}
                  variants={
                    reducedMotion
                      ? undefined
                      : itemVariants
                  }
                  whileHover={
                    reducedMotion
                      ? undefined
                      : { x: 3 }
                  }
                  whileTap={
                    reducedMotion
                      ? undefined
                      : { scale: 0.98 }
                  }
                  className="
                    group
                    flex
                    min-h-12
                    min-w-[190px]
                    items-center
                    gap-3
                    rounded-[14px]
                    px-3
                    text-sm
                    font-semibold
                    text-[var(--brand-text-dark)]
                    outline-none
                    transition-colors
                    hover:bg-[var(--brand-primary-soft)]
                    focus-visible:bg-[var(--brand-primary-soft)]
                    focus-visible:ring-2
                    focus-visible:ring-[var(--brand-primary)]
                  "
                >
                  <span
                    className="
                      grid
                      size-9
                      shrink-0
                      place-items-center
                      rounded-full
                      bg-[var(--brand-primary-soft)]
                      text-[var(--brand-primary)]
                      transition
                      group-hover:bg-[var(--brand-primary)]
                      group-hover:text-white
                    "
                  >
                    <ConnectIcon
                      kind={item.kind}
                    />
                  </span>

                  {item.label}
                </motion.a>
              ))}

              {/* Company profile */}
              <motion.button
                type="button"
                onClick={downloadCompanyProfile}
                variants={
                  reducedMotion
                    ? undefined
                    : itemVariants
                }
                whileHover={
                  reducedMotion
                    ? undefined
                    : { x: 3 }
                }
                whileTap={
                  reducedMotion
                    ? undefined
                    : { scale: 0.98 }
                }
                className="
                  group
                  flex
                  min-h-12
                  w-full
                  min-w-[190px]
                  items-center
                  gap-3
                  rounded-[14px]
                  px-3
                  text-left
                  text-sm
                  font-semibold
                  text-[var(--brand-text-dark)]
                  outline-none
                  transition-colors
                  hover:bg-[var(--brand-primary-soft)]
                  focus-visible:bg-[var(--brand-primary-soft)]
                  focus-visible:ring-2
                  focus-visible:ring-[var(--brand-primary)]
                "
              >
                <span
                  className="
                    grid
                    size-9
                    shrink-0
                    place-items-center
                    rounded-full
                    bg-[var(--brand-primary-soft)]
                    text-[var(--brand-primary)]
                    transition
                    group-hover:bg-[var(--brand-primary)]
                    group-hover:text-white
                  "
                >
                  <FileText
                    size={18}
                    strokeWidth={1.8}
                  />
                </span>

                <span className="flex flex-1 items-center justify-between gap-4">
                  Company Profile

                  <Download
                    size={14}
                    className="text-[var(--brand-muted)]"
                  />
                </span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Connect button */}
        <motion.button
          ref={triggerRef}
          type="button"
          aria-expanded={open}
          aria-controls="connect-actions"
          onClick={() =>
            setOpen((current) => !current)
          }
          whileHover={
            reducedMotion
              ? undefined
              : { scale: 1.025 }
          }
          whileTap={
            reducedMotion
              ? undefined
              : { scale: 0.96 }
          }
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 22,
          }}
          className="
            inline-flex
            min-h-12
            cursor-pointer
            items-center
            gap-2.5
            rounded-full
            bg-[var(--brand-primary)]
            px-5
            font-semibold
            text-white
            shadow-[0_14px_38px_rgba(81,0,0,0.28)]
            outline-none
            transition-colors
            hover:bg-[var(--brand-primary-dark)]
            focus-visible:ring-2
            focus-visible:ring-[var(--brand-primary)]
            focus-visible:ring-offset-2
          "
        >
          <span className="relative grid size-5 place-items-center">
            <AnimatePresence
              mode="wait"
              initial={false}
            >
              {open ? (
                <motion.span
                  key="close"
                  initial={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className="absolute"
                >
                  <X size={20} />
                </motion.span>
              ) : (
                <motion.span
                  key="share"
                  initial={{
                    opacity: 0,
                    rotate: 90,
                    scale: 0.7,
                  }}
                  animate={{
                    opacity: 1,
                    rotate: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    rotate: -90,
                    scale: 0.7,
                  }}
                  transition={{
                    duration: 0.16,
                  }}
                  className="absolute"
                >
                  <Share2 size={20} />
                </motion.span>
              )}
            </AnimatePresence>
          </span>

          {open ? "Close" : "Connect"}
        </motion.button>
      </div>

      {/* Download status */}
      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.97,
            }}
            className="
              fixed
              bottom-15
              left-1/2
              z-[100]
              w-[calc(100%-2rem)]
              max-w-[390px]
              -translate-x-1/2
              rounded-[20px]
              bg-[var(--brand-background)]
              p-4
              shadow-[0_20px_60px_rgba(81,0,0,0.20)]
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  grid
                  size-11
                  shrink-0
                  place-items-center
                  rounded-full
                  bg-[var(--brand-primary-soft)]
                  text-[var(--brand-primary)]
                "
              >
                <FileText size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-text-dark)]">
                      Downloading Company Profile
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--brand-muted)]">
                      Velvet Crust PDF
                    </p>
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-[var(--brand-primary)]">
                    {progress}%
                  </span>
                </div>

                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--brand-primary-soft)]">
                  <motion.div
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="h-full rounded-full bg-[var(--brand-primary)]"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {downloadSuccess && (
          <motion.div
            initial={{
              opacity: 0,
              y: 24,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 15,
              scale: 0.97,
            }}
            className="
              fixed
              bottom-15
              left-1/2
              z-[100]
              flex
              w-[calc(100%-2rem)]
              max-w-[370px]
              -translate-x-1/2
              items-center
              gap-3
              rounded-[18px]
              bg-[var(--brand-primary)]
              px-4
              py-3.5
              text-white
              shadow-[0_18px_50px_rgba(81,0,0,0.28)]
            "
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/15">
              <Check size={19} />
            </span>

            <div>
              <p className="text-sm font-semibold">
                Download complete
              </p>

              <p className="mt-0.5 text-xs text-white/75">
                Company profile downloaded successfully.
              </p>
            </div>
          </motion.div>
        )}

        {downloadError && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: 15,
            }}
            className="
              fixed
              bottom-20
              left-1/2
              z-[100]
              w-[calc(100%-2rem)]
              max-w-[370px]
              -translate-x-1/2
              rounded-[18px]
              bg-[var(--brand-primary)]
              px-5
              py-4
              text-sm
              font-medium
              text-white
              shadow-xl
            "
          >
            Unable to download the company profile.
            Please try again.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}