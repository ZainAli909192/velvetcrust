"use client";

import { useEffect, useRef, useState } from "react";
import {
  BriefcaseBusiness,
  CalendarHeart,
  Check,
  ChevronDown,
  Handshake,
  HeartHandshake,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export type CollaborationType =
  | "Brand Collaboration"
  | "Corporate Partnership"
  | "Events & Gifting";

type CollaborationTypesProps = {
  value: CollaborationType | "";
  onChange: (value: CollaborationType) => void;
};

const collaborationOptions = [
  {
    title: "Brand Collaboration" as CollaborationType,
    description: "Creative campaigns & brand partnerships",
    icon: HeartHandshake,
  },
  {
    title: "Corporate Partnership" as CollaborationType,
    description: "Corporate gifting & business opportunities",
    icon: BriefcaseBusiness,
  },
  {
    title: "Events & Gifting" as CollaborationType,
    description: "Celebrations, events & special moments",
    icon: CalendarHeart,
  },
];

export default function CollaborationTypes({
  value,
  onChange,
}: CollaborationTypesProps) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selected = collaborationOptions.find(
    (item) => item.title === value
  );

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.div
      ref={wrapperRef}
      initial={{
        opacity: 0,
        y: 24,
        scale: 0.98,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.3,
      }}
      transition={{
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative w-full"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        className={`
          group
          relative
          flex
          min-h-[74px]
          w-full
          cursor-pointer
          items-center
          gap-4
          overflow-hidden
          rounded-[20px]
          border
          px-4
          py-3
          text-left
          transition-all
          duration-300

          sm:min-h-[80px]
          sm:rounded-[22px]
          sm:px-5

          ${
            open
              ? `
                border-[#6E2527]/35
                bg-white
                shadow-[0_16px_45px_rgba(81,0,0,0.10)]
              `
              : `
                border-[#6E2527]/15
                bg-white/90
                shadow-[0_8px_30px_rgba(81,0,0,0.05)]
                hover:border-[#6E2527]/30
              `
          }
        `}
      >
        <motion.div
          animate={{
            scale: open ? 1.05 : 1,
          }}
          transition={{
            duration: 0.25,
          }}
          className="
            grid
            size-11
            shrink-0
            place-items-center
            rounded-full
            bg-[#6E2527]/[0.07]
            text-[#721C20]

            sm:size-12
          "
        >
          {selected ? (
            <selected.icon
              size={21}
              strokeWidth={1.6}
            />
          ) : (
            <Handshake
              size={21}
              strokeWidth={1.6}
            />
          )}
        </motion.div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-[#9B7771]
            "
          >
            Collaboration Type
          </p>

          <AnimatePresence mode="wait">
            <motion.p
              key={selected?.title || "placeholder"}
              initial={{
                opacity: 0,
                y: 5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -5,
              }}
              transition={{
                duration: 0.2,
              }}
              className="
                mt-1
                truncate
                text-[14px]
                font-semibold
                text-[#55191D]

                sm:text-[15px]
              "
            >
              {selected?.title || "Choose collaboration type"}
            </motion.p>
          </AnimatePresence>
        </div>

        <motion.div
          animate={{
            rotate: open ? 180 : 0,
          }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            grid
            size-9
            shrink-0
            place-items-center
            rounded-full
            bg-[#FFF7EA]
            text-[#6E2527]
          "
        >
          <ChevronDown
            size={18}
            strokeWidth={1.8}
          />
        </motion.div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{
              opacity: 0,
              y: -8,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -8,
              scale: 0.98,
            }}
            transition={{
              duration: 0.28,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              absolute
              left-0
              top-[calc(100%+10px)]
              z-50
              w-full
              overflow-hidden
              rounded-[22px]
              border
              border-[#6E2527]/10
              bg-[#FFFDF9]
              p-2
              shadow-[0_24px_65px_rgba(81,0,0,0.14)]
            "
          >
            <div className="space-y-1">
              {collaborationOptions.map((item, index) => {
                const Icon = item.icon;
                const active = value === item.title;

                return (
                  <motion.button
                    key={item.title}
                    type="button"
                    initial={{
                      opacity: 0,
                      x: -12,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    whileTap={{
                      scale: 0.985,
                    }}
                    onClick={() => {
                      onChange(item.title);
                      setOpen(false);
                    }}
                    className={`
                      group
                      relative
                      flex
                      w-full
                      cursor-pointer
                      items-center
                      gap-3
                      rounded-[16px]
                      px-3
                      py-3
                      text-left
                      transition-colors
                      duration-200

                      sm:px-4
                      sm:py-4

                      ${
                        active
                          ? `
                            bg-[#6E2527]
                            text-white
                          `
                          : `
                            text-[#55191D]
                            hover:bg-[#6E2527]/[0.055]
                          `
                      }
                    `}
                  >
                    <div
                      className={`
                        grid
                        size-10
                        shrink-0
                        place-items-center
                        rounded-full
                        transition-colors

                        ${
                          active
                            ? `
                              bg-white/10
                              text-[#F3D7C8]
                            `
                            : `
                              bg-[#6E2527]/[0.07]
                              text-[#721C20]
                            `
                        }
                      `}
                    >
                      <Icon
                        size={19}
                        strokeWidth={1.55}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p
                        className="
                          text-[13px]
                          font-semibold
                          tracking-[0.01em]

                          sm:text-sm
                        "
                      >
                        {item.title}
                      </p>

                      <p
                        className={`
                          mt-0.5
                          truncate
                          text-[10px]
                          leading-4

                          sm:text-[11px]

                          ${
                            active
                              ? "text-white/60"
                              : "text-[#826863]/70"
                          }
                        `}
                      >
                        {item.description}
                      </p>
                    </div>

                    <AnimatePresence>
                      {active && (
                        <motion.span
                          initial={{
                            opacity: 0,
                            scale: 0,
                          }}
                          animate={{
                            opacity: 1,
                            scale: 1,
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 24,
                          }}
                          className="
                            grid
                            size-7
                            shrink-0
                            place-items-center
                            rounded-full
                            bg-[#F3D7C8]
                            text-[#55191D]
                          "
                        >
                          <Check
                            size={14}
                            strokeWidth={2.2}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <div
              className="
                pointer-events-none
                absolute
                -right-14
                -top-14
                size-32
                rounded-full
                border
                border-[#6E2527]/[0.04]
              "
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}