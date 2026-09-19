"use client";

import axios from "axios";

import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";

import {
  ArrowRight,
  ChevronDown,
  Mail,
  MessageSquareText,
  Phone,
  UserRound,
} from "lucide-react";

import {
  AnimatePresence,
  motion,
} from "framer-motion";

import {
  countryPhoneCodes,
} from "@/lib/countries";

import CollaborationTypes, {
  type CollaborationType,
} from "./collaboration-types";

import CollaborationSuccess from "./collaboration-success";

const viewport = {
  once: true,
  amount: 0.2,
};

type FormData = {
  name: string;
  email: string;
  countryCode: string;
  phone: string;
  type: CollaborationType | "";
  message: string;
};

const initialForm: FormData = {
  name: "",
  email: "",
  countryCode: "+971",
  phone: "",
  type: "",
  message: "",
};

export default function CollaborationForm() {
  const [form, setForm] =
    useState<FormData>(initialForm);

  const [submitting, setSubmitting] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [showTypeError, setShowTypeError] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  function updateField(
    field: keyof FormData,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    if (submitError) {
      setSubmitError("");
    }
  }

  function handleTypeChange(
    value: CollaborationType,
  ) {
    setForm((current) => ({
      ...current,
      type: value,
    }));

    setShowTypeError(false);
    setSubmitError("");
  }

  function handlePhoneChange(
    value: string,
  ) {
    const numbersOnly =
      value.replace(/\D/g, "");

    updateField(
      "phone",
      numbersOnly.slice(0, 15),
    );
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.type) {
      setShowTypeError(true);
      return;
    }

    if (
      form.phone.length < 6 ||
      form.phone.length > 15
    ) {
      setSubmitError(
        "Please enter a valid phone number.",
      );
      return;
    }

    try {
      setSubmitting(true);
      setShowTypeError(false);
      setSubmitError("");

      const phone =
        `${form.countryCode}${form.phone}`;

      await axios.post(
        "/api/collaborations",
        {
          name: form.name,
          email: form.email,
          phone,
          type: form.type,
          message: form.message,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        },
      );

      setSuccess(true);
    } catch (error) {
      console.error(
        "Collaboration enquiry failed:",
        error,
      );

      if (axios.isAxiosError(error)) {
        const message =
          typeof error.response?.data
            ?.message === "string"
            ? error.response.data.message
            : "Unable to send your enquiry. Please try again.";

        setSubmitError(message);

        return;
      }

      setSubmitError(
        "Unable to send your enquiry. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleReset() {
    setSuccess(false);
    setSubmitting(false);
    setShowTypeError(false);
    setSubmitError("");
    setForm(initialForm);
  }

  return (
    <section
      id="collaboration-form"
      className="
        relative
        overflow-hidden
        bg-[#FFF9F2]
        px-5
        py-20

        sm:px-10
        sm:py-24

        lg:px-16
        lg:py-28

        xl:px-24
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-32
          top-[20%]
          size-[320px]
          rounded-full
          bg-[#F3D7C8]/20
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-40
          bottom-[10%]
          size-[400px]
          rounded-full
          bg-[#510000]/[0.035]
          blur-[100px]
        "
      />

      <div className="relative z-10 mx-auto max-w-[1180px]">
        <motion.div
          initial={{
            opacity: 0,
            x: -35,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={viewport}
          transition={{
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mb-10 lg:mb-14"
        >
          <div className="flex items-center gap-3">
            <span className="h-px w-7 bg-[#8B5550]" />

            <p
              className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#8B5550]

                sm:text-[10px]
              "
            >
              Your Idea
            </p>
          </div>

          <h2
            className="
              mt-4
              font-serif
              text-[42px]
              leading-[0.95]
              tracking-[-0.04em]
              text-[#510000]

              sm:text-5xl

              lg:text-6xl
            "
          >
            Tell us what you &nbsp;

            <span className="text-[#A86F5A]">
              have in mind.
            </span>
          </h2>

          <p
            className="
              mt-5
              max-w-[470px]
              text-sm
              leading-6
              text-[#6D514C]

              sm:text-[15px]
            "
          >
            Choose how you&apos;d like to
            collaborate and share a few details
            with us.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {success ? (
            <CollaborationSuccess
              key="collaboration-success"
              onReset={handleReset}
            />
          ) : (
            <motion.form
              key="collaboration-form"
              onSubmit={handleSubmit}
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
                y: -20,
                scale: 0.98,
              }}
              transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <motion.div
                initial={{
                  opacity: 0,
                  y: 30,
                  scale: 0.97,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={viewport}
                transition={{
                  duration: 0.65,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <CollaborationTypes
                  value={form.type}
                  onChange={
                    handleTypeChange
                  }
                />

                <AnimatePresence>
                  {showTypeError && (
                    <motion.p
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      className="
                        mt-3
                        text-xs
                        font-medium
                        text-[#A02020]
                      "
                    >
                      Please select a
                      collaboration type.
                    </motion.p>
                  )}
                </AnimatePresence>
              </motion.div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.98,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={viewport}
                transition={{
                  duration: 0.7,
                  delay: 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="
                  mt-7
                  rounded-[28px]
                  border
                  border-[#510000]/10
                  bg-white
                  p-5
                  shadow-[0_20px_70px_rgba(81,0,0,0.055)]

                  sm:mt-8
                  sm:p-7

                  lg:rounded-[34px]
                  lg:p-10
                "
              >
                <div
                  className="
                    grid
                    grid-cols-1
                    gap-x-7
                    gap-y-5

                    md:grid-cols-2
                  "
                >
                  <Field
                    icon={
                      <UserRound
                        size={17}
                      />
                    }
                    label="Full Name"
                    required
                  >
                    <input
                      type="text"
                      required
                      minLength={2}
                      maxLength={80}
                      autoComplete="name"
                      value={form.name}
                      onChange={(event) =>
                        updateField(
                          "name",
                          event.target.value,
                        )
                      }
                      placeholder="Your name"
                      className={
                        inputStyles
                      }
                    />
                  </Field>

                  <Field
                    icon={
                      <Mail size={17} />
                    }
                    label="Email"
                    required
                  >
                    <input
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                      value={form.email}
                      onChange={(event) =>
                        updateField(
                          "email",
                          event.target.value,
                        )
                      }
                      placeholder="you@example.com"
                      className={
                        inputStyles
                      }
                    />
                  </Field>

                  <Field
                    icon={
                      <Phone size={17} />
                    }
                    label="Phone / WhatsApp"
                    required
                  >
                    <div className="flex gap-2">
                      <div
                        className="
                          relative
                          w-[135px]
                          shrink-0

                          sm:w-[150px]
                        "
                      >
                        <select
                          required
                          aria-label="Country calling code"
                          value={
                            form.countryCode
                          }
                          onChange={(
                            event,
                          ) =>
                            updateField(
                              "countryCode",
                              event.target
                                .value,
                            )
                          }
                          className="
                            min-h-14
                            w-full
                            cursor-pointer
                            appearance-none
                            rounded-[16px]
                            border
                            border-[#510000]/10
                            bg-[#FFF9F2]
                            py-3
                            pl-4
                            pr-9
                            text-sm
                            text-[#432B28]
                            outline-none
                            transition-all
                            duration-300

                            hover:border-[#510000]/20

                            focus:border-[#510000]/35
                            focus:bg-white
                            focus:shadow-[0_0_0_4px_rgba(81,0,0,0.04)]
                          "
                        >
                          {countryPhoneCodes.map(
                            (country) => (
                              <option
                                key={
                                  country.code
                                }
                                value={
                                  country.dialCode
                                }
                              >
                                {
                                  country.code
                                }{" "}
                                {
                                  country.dialCode
                                }
                              </option>
                            ),
                          )}
                        </select>

                        <ChevronDown
                          size={15}
                          aria-hidden="true"
                          className="
                            pointer-events-none
                            absolute
                            right-3
                            top-1/2
                            -translate-y-1/2
                            text-[#8D5550]
                          "
                        />
                      </div>

                      <input
                        type="tel"
                        required
                        inputMode="numeric"
                        autoComplete="tel-national"
                        minLength={6}
                        maxLength={15}
                        value={form.phone}
                        onChange={(
                          event,
                        ) =>
                          handlePhoneChange(
                            event.target
                              .value,
                          )
                        }
                        onKeyDown={(
                          event,
                        ) => {
                          if (
                            [
                              "e",
                              "E",
                              "+",
                              "-",
                              ".",
                              " ",
                            ].includes(
                              event.key,
                            )
                          ) {
                            event.preventDefault();
                          }
                        }}
                        placeholder="501234567"
                        className={
                          inputStyles
                        }
                      />
                    </div>
                  </Field>
                </div>

                <div className="mt-5">
                  <Field
                    icon={
                      <MessageSquareText
                        size={17}
                      />
                    }
                    label="Tell Us About Your Idea"
                    required
                  >
                    <textarea
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={5}
                      value={
                        form.message
                      }
                      onChange={(event) =>
                        updateField(
                          "message",
                          event.target
                            .value,
                        )
                      }
                      placeholder="A few details about your collaboration..."
                      className={`
                        ${inputStyles}
                        min-h-[135px]
                        resize-none
                      `}
                    />
                  </Field>

                  <div className="mt-2 flex justify-end">
                    <span
                      className="
                        text-[10px]
                        text-[#765E59]/55
                      "
                    >
                      {
                        form.message
                          .length
                      }
                      /2000
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {submitError && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: -5,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: -5,
                      }}
                      role="alert"
                      className="
                        mt-5
                        rounded-[14px]
                        border
                        border-[#A02020]/10
                        bg-[#A02020]/[0.04]
                        px-4
                        py-3
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-medium
                          leading-5
                          text-[#A02020]
                        "
                      >
                        {submitError}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div
                  className="
                    mt-7
                    flex
                    flex-col
                    gap-4

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <p
                    className="
                      max-w-[350px]
                      text-[11px]
                      leading-5
                      text-[#765E59]/70
                    "
                  >
                    We&apos;ll review your
                    enquiry and get back to
                    you if the collaboration
                    is a good fit.
                  </p>

                  <motion.button
                    type="submit"
                    disabled={
                      submitting
                    }
                    whileHover={
                      submitting
                        ? undefined
                        : {
                            scale: 1.02,
                            y: -2,
                          }
                    }
                    whileTap={
                      submitting
                        ? undefined
                        : {
                            scale: 0.97,
                          }
                    }
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      inline-flex
                      min-h-14
                      w-full
                      cursor-pointer
                      items-center
                      justify-center
                      gap-3
                      rounded-full
                      bg-[#510000]
                      px-8
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-white
                      shadow-[0_12px_30px_rgba(81,0,0,0.16)]
                      transition-colors
                      duration-300

                      hover:bg-[#6B1515]

                      disabled:cursor-not-allowed
                      disabled:opacity-60

                      sm:w-auto
                      sm:min-w-[210px]
                    "
                  >
                    <AnimatePresence
                      mode="wait"
                      initial={false}
                    >
                      {submitting ? (
                        <motion.span
                          key="submitting"
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
                            flex
                            items-center
                            gap-3
                          "
                        >
                          <motion.span
                            animate={{
                              rotate: 360,
                            }}
                            transition={{
                              duration: 0.8,
                              repeat:
                                Infinity,
                              ease: "linear",
                            }}
                            className="
                              size-4
                              rounded-full
                              border-2
                              border-white/30
                              border-t-white
                            "
                          />

                          Sending
                        </motion.span>
                      ) : (
                        <motion.span
                          key="send"
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
                            flex
                            items-center
                            gap-3
                          "
                        >
                          Send Enquiry

                          <ArrowRight
                            size={16}
                          />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                </div>
              </motion.div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

type FieldProps = {
  label: string;
  icon: ReactNode;
  required?: boolean;
  children: ReactNode;
};

function Field({
  label,
  icon,
  required = false,
  children,
}: FieldProps) {
  return (
    <label className="block">
      <span
        className="
          mb-2
          flex
          items-center
          gap-2
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.12em]
          text-[#6D4843]
        "
      >
        <span className="text-[#8D3434]">
          {icon}
        </span>

        {label}

        {required && (
          <span className="text-[#A02020]">
            *
          </span>
        )}
      </span>

      {children}
    </label>
  );
}

const inputStyles = `
  min-h-14
  w-full
  rounded-[16px]
  border
  border-[#510000]/10
  bg-[#FFF9F2]
  px-4
  py-3
  text-sm
  text-[#432B28]
  outline-none
  transition-all
  duration-300

  placeholder:text-[#765E59]/45

  hover:border-[#510000]/20

  focus:border-[#510000]/35
  focus:bg-white
  focus:shadow-[0_0_0_4px_rgba(81,0,0,0.04)]
`;