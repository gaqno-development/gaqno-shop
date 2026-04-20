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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        <SignupHeader />
        <SignupErrorBanner message={error} />
        <SignupForm
          data={form.formData}
          errors={form.formErrors}
          isLoading={isLoading}
          onChange={form.patch}
          onSubmit={handleSubmit}
        />
        <SignupFooter />
      </div>
    </div>
  );
}
