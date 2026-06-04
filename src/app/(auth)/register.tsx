import { useCallback, useState } from "react";

import CreateAccountForm from "@/components/auth/create-account-form";
import OtpVerification from "@/components/auth/otp-verification";
import VerificationSuccess from "@/components/auth/verification-success";

// ---------------------------------------------------------------------------
// Register screen — orchestrates the 3-step auth flow
// ---------------------------------------------------------------------------

export default function RegisterScreen() {
  const [step, setStep] = useState<"form" | "otp" | "success">("form");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const handleFormNext = useCallback((rawPhone: string, userEmail: string) => {
    setPhone(rawPhone);
    setEmail(userEmail);
    setStep("otp");
  }, []);

  const handleOtpVerify = useCallback(() => {
    setStep("success");
  }, []);

  const handleOtpBack = useCallback(() => {
    setStep("form");
  }, []);

  switch (step) {
    case "otp":
      return (
        <OtpVerification
          phone={phone}
          email={email}
          onVerify={handleOtpVerify}
          onBack={handleOtpBack}
        />
      );
    case "success":
      return <VerificationSuccess />;
    default:
      return <CreateAccountForm onNext={handleFormNext} />;
  }
}
