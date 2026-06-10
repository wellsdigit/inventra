import { useCallback, useState } from "react";
import { router } from "expo-router";

import CreateAccountForm from "@/components/auth/create-account-form";
import OtpVerification from "@/components/auth/otp-verification";
import SetPassword from "@/components/auth/set-password";
import SetupAccount from "@/components/auth/setup-account";
import VerificationSuccess from "@/components/auth/verification-success";

// ---------------------------------------------------------------------------
// Register screen — orchestrates the 5-step auth flow
// Form → OTP → Success → Set Password → Setup Account → Tabs
// ---------------------------------------------------------------------------

type Step = "form" | "otp" | "success" | "password" | "setup";

export default function RegisterScreen() {
  const [step, setStep] = useState<Step>("form");
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

  const handleSuccessContinue = useCallback(() => {
    setStep("password");
  }, []);

  const handlePasswordNext = useCallback((_pin: string) => {
    setStep("setup");
  }, []);

  const handlePasswordBack = useCallback(() => {
    setStep("success");
  }, []);

  const handleSetupNext = useCallback(
    (_businessName: string, _location: string) => {
      router.replace("/(tabs)");
    },
    [],
  );

  const handleSetupBack = useCallback(() => {
    setStep("password");
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
      return <VerificationSuccess onContinue={handleSuccessContinue} />;
    case "password":
      return (
        <SetPassword
          onNext={handlePasswordNext}
          onBack={handlePasswordBack}
        />
      );
    case "setup":
      return (
        <SetupAccount
          onNext={handleSetupNext}
          onBack={handleSetupBack}
        />
      );
    default:
      return <CreateAccountForm onNext={handleFormNext} />;
  }
}
