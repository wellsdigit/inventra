import { useCallback, useState } from "react";
import { router } from "expo-router";
import { useAppStore } from "@/store/app-store";

import LoginPhone from "@/components/auth/login-phone";
import LoginPassword from "@/components/auth/login-password";
import ForgotPhone from "@/components/auth/forgot-phone";
import ForgotOtp from "@/components/auth/forgot-otp";
import ForgotNewPin from "@/components/auth/forgot-new-pin";
import ForgotSuccess from "@/components/auth/forgot-success";

// ---------------------------------------------------------------------------
// Login screen — orchestrates login + forgot-password flows
// Login:  phone → password → /(tabs)
// Forgot: forgotPhone → forgotOtp → forgotNewPin → forgotSuccess → phone
// ---------------------------------------------------------------------------

type Step =
  | "phone"
  | "password"
  | "forgotPhone"
  | "forgotOtp"
  | "forgotNewPin"
  | "forgotSuccess";

export default function LoginScreen() {
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [forgotPhone, setForgotPhone] = useState("");

  // ── Login flow ──────────────────────────────────────────────────────────

  const handlePhoneNext = useCallback((userPhone: string) => {
    setPhone(userPhone);
    setStep("password");
  }, []);

  const setRole = useAppStore(state => state.setRole);

  const handleLogin = useCallback((pin: string) => {
    if (phone.toLowerCase() === '1234567890' && pin === '1234') {
      setRole('admin');
    } else {
      setRole('attendance');
    }
    router.replace("/(tabs)");
  }, [phone, setRole]);

  const handlePasswordBack = useCallback(() => {
    setStep("phone");
  }, []);

  // ── Forgot password flow ────────────────────────────────────────────────

  const handleForgotPassword = useCallback(() => {
    setStep("forgotPhone");
  }, []);

  const handleForgotPhoneNext = useCallback((rawPhone: string) => {
    setForgotPhone(rawPhone);
    setStep("forgotOtp");
  }, []);

  const handleForgotPhoneBack = useCallback(() => {
    setStep("password");
  }, []);

  const handleForgotOtpContinue = useCallback(() => {
    setStep("forgotNewPin");
  }, []);

  const handleForgotOtpBack = useCallback(() => {
    setStep("forgotPhone");
  }, []);

  const handleForgotNewPinContinue = useCallback((_pin: string) => {
    setStep("forgotSuccess");
  }, []);

  const handleForgotNewPinBack = useCallback(() => {
    setStep("forgotOtp");
  }, []);

  const handleForgotSuccessLogin = useCallback(() => {
    setStep("phone");
  }, []);

  // ── Render ──────────────────────────────────────────────────────────────

  switch (step) {
    case "password":
      return (
        <LoginPassword
          onLogin={handleLogin}
          onBack={handlePasswordBack}
          onForgotPassword={handleForgotPassword}
        />
      );
    case "forgotPhone":
      return (
        <ForgotPhone
          onNext={handleForgotPhoneNext}
          onBack={handleForgotPhoneBack}
        />
      );
    case "forgotOtp":
      return (
        <ForgotOtp
          phone={forgotPhone}
          onContinue={handleForgotOtpContinue}
          onBack={handleForgotOtpBack}
        />
      );
    case "forgotNewPin":
      return (
        <ForgotNewPin
          onContinue={handleForgotNewPinContinue}
          onBack={handleForgotNewPinBack}
        />
      );
    case "forgotSuccess":
      return <ForgotSuccess onLogin={handleForgotSuccessLogin} />;
    default:
      return <LoginPhone onNext={handlePhoneNext} />;
  }
}
