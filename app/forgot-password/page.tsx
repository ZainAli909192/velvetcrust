import ForgotPasswordFlow from "@/components/auth/password-reset/forgot-password-flow";

export default function ForgotPasswordPage() {
  return (
    <main
      className="
        relative
        min-h-[100dvh]
        overflow-hidden
        bg-[#FFF8EF]
        px-4
        pb-28
        pt-8

        sm:px-6
        sm:py-14

        lg:flex
        lg:items-center
        lg:justify-center
        lg:py-16
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -left-40
          top-20
          h-[380px]
          w-[380px]
          rounded-full
          bg-[#F2D7CA]/35
          blur-[100px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          bottom-10
          h-[330px]
          w-[330px]
          rounded-full
          bg-[#721C20]/[0.05]
          blur-[100px]
        "
      />

      <section
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-[560px]
          rounded-[30px]
          border
          border-[#EBD5C8]
          bg-white/90
          px-5
          py-7
          shadow-[0_24px_80px_rgba(81,0,0,0.06)]
          backdrop-blur-xl

          sm:rounded-[36px]
          sm:px-10
          sm:py-10

          lg:px-12
          lg:py-11
        "
      >
        <ForgotPasswordFlow />
      </section>
    </main>
  );
}