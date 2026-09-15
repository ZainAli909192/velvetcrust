"use client";

import { useState } from "react";
import {
  Check,
  Download,
  FileText,
} from "lucide-react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

type Props = {
  onStart?: () => void;
};

export default function DownloadCompanyProfile({
  onStart,
}: Props) {
  const [downloading, setDownloading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [progress, setProgress] = useState(0);

  const reducedMotion = useReducedMotion();

  async function handleDownload() {
    if (downloading) return;

    onStart?.();

    setDownloading(true);
    setSuccess(false);
    setError(false);
    setProgress(12);

    let timer: ReturnType<typeof setInterval> | null = null;

    try {
      timer = setInterval(() => {
        setProgress((current) => {
          if (current >= 85) return current;

          return Math.min(
            current + Math.floor(Math.random() * 8) + 3,
            85
          );
        });
      }, 180);

      const response = await fetch("/companyprofile.pdf");

      if (!response.ok) {
        throw new Error("Unable to download company profile");
      }

      const blob = await response.blob();

      if (timer) {
        clearInterval(timer);
      }

      setProgress(100);

      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "Velvet-Crust-Company-Profile.pdf";

      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 1000);

      setTimeout(() => {
        setDownloading(false);
        setSuccess(true);
      }, 450);

      setTimeout(() => {
        setSuccess(false);
      }, 3500);
    } catch (err) {
      if (timer) {
        clearInterval(timer);
      }

      console.error(err);

      setDownloading(false);
      setProgress(0);
      setError(true);

      setTimeout(() => {
        setError(false);
      }, 4000);
    }
  }

  return (
    <>
      <motion.button
        type="button"
        onClick={handleDownload}
        disabled={downloading}
        whileHover={
          reducedMotion ? undefined : { x: 3 }
        }
        whileTap={
          reducedMotion ? undefined : { scale: 0.98 }
        }
        className="
          group
          flex
          min-h-12
          w-full
          min-w-[210px]
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
          focus-visible:ring-2
          focus-visible:ring-[var(--brand-primary)]
          disabled:pointer-events-none
          disabled:opacity-60
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
            transition-colors
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

      <AnimatePresence>
        {downloading && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
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
            transition={{
              duration: 0.3,
            }}
            className="
              fixed
              bottom-[calc(7.5rem+env(safe-area-inset-bottom))]
              left-1/2
              z-[110]
              w-[calc(100%-2rem)]
              max-w-[390px]
              -translate-x-1/2
              rounded-[20px]
              border
              border-[var(--brand-border)]
              bg-[var(--brand-background)]
              p-4
              shadow-[0_20px_60px_rgba(81,0,0,0.20)]

              lg:bottom-8
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
                      Downloading Profile
                    </p>

                    <p className="mt-0.5 text-xs text-[var(--brand-muted)]">
                      Velvet Crust PDF
                    </p>
                  </div>

                  <span className="text-xs font-semibold tabular-nums text-[var(--brand-primary)]">
                    {progress}%
                  </span>
                </div>

                <div
                  className="
                    mt-3
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-[var(--brand-primary-soft)]
                  "
                >
                  <motion.div
                    animate={{
                      width: `${progress}%`,
                    }}
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    className="
                      h-full
                      rounded-full
                      bg-[var(--brand-primary)]
                    "
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.95,
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
              bottom-[calc(7.5rem+env(safe-area-inset-bottom))]
              left-1/2
              z-[110]
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

              lg:bottom-8
            "
          >
            <motion.span
              initial={{
                scale: 0,
                rotate: -20,
              }}
              animate={{
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 20,
              }}
              className="
                grid
                size-9
                shrink-0
                place-items-center
                rounded-full
                bg-white/15
              "
            >
              <Check size={18} />
            </motion.span>

            <div>
              <p className="text-sm font-semibold">
                Download complete
              </p>

              <p className="mt-0.5 text-xs text-white/70">
                Company profile saved successfully.
              </p>
            </div>
          </motion.div>
        )}

        {error && (
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
              bottom-[calc(7.5rem+env(safe-area-inset-bottom))]
              left-1/2
              z-[110]
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

              lg:bottom-8
            "
          >
            Unable to download the company profile. Please try again.
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}