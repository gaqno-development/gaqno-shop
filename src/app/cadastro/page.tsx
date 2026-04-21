"use client";

import {
  SignupErrorBanner,
  SignupFooter,
  SignupForm,
  SignupHeader,
  SignupSuccessScreen,
} from "./components";
import { useSignupPage } from "./hooks/useSignupPage";

export default function RegisterPage() {
  const { form, isLoading, error, success, handleSubmit } = useSignupPage();

  if (success) {
    return <SignupSuccessScreen email={form.formData.email} />;
  }

  return (
    <section className="relative min-h-[calc(100vh-var(--header-height,0px))] overflow-hidden bg-[var(--paper)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -right-40 h-[520px] w-[520px] rounded-full opacity-[0.18] blur-3xl"
        style={{ background: "var(--tenant-primary)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-20 left-[10%] h-[340px] w-[340px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--tenant-secondary)" }}
      />

      <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 pt-20 pb-24 md:pt-28 md:pb-32 lg:grid-cols-[1.1fr_1fr] lg:gap-20 lg:px-10">
        <SignupHeader />

        <div className="relative flex flex-col justify-center">
          <SignupErrorBanner message={error} />
          <div className={error ? "mt-6" : undefined}>
            <SignupForm
              data={form.formData}
              errors={form.formErrors}
              isLoading={isLoading}
              onChange={form.patch}
              onSubmit={handleSubmit}
            />
          </div>
          <SignupFooter />
        </div>
      </div>
    </section>
  );
}
