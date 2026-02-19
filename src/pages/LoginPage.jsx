import { useEffect, useRef, useState } from "react";
import {
  RecaptchaVerifier,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { BsMicrosoft } from "react-icons/bs";
import { FaApple } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { FiPhone } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";

import { auth, googleProvider, hasFirebaseConfig } from "../lib/firebase";

const inputClass =
  "w-full rounded-full border border-white/35 bg-[#202123] px-6 py-4 text-sm text-white/90 outline-none placeholder:text-white/50";

const providerButtonClass =
  "flex w-full items-center justify-center gap-3 rounded-full border border-white/20 bg-[#202123] px-5 py-4 text-white transition-colors hover:bg-[#2a2b30] disabled:opacity-60";

const normalizePhoneNumber = (rawValue) => {
  const trimmed = rawValue.trim().replace(/[\s()-]/g, "");

  if (trimmed.startsWith("00")) {
    return `+${trimmed.slice(2)}`;
  }

  if (!trimmed.startsWith("+")) {
    return trimmed;
  }

  return `+${trimmed.slice(1).replace(/\+/g, "")}`;
};

const mapFirebasePhoneError = (error) => {
  const code = error?.code || "";

  switch (code) {
    case "auth/invalid-phone-number":
      return "Invalid phone format. Use E.164 format like +919876543210.";
    case "auth/missing-phone-number":
      return "Phone number is missing.";
    case "auth/operation-not-allowed":
      return "Phone sign-in is disabled in Firebase Console.";
    case "auth/app-not-authorized":
      return "This app is not authorized for Firebase Authentication. Recheck API key + authorized domain.";
    case "auth/unauthorized-domain":
      return "Current domain is not authorized. Add it in Firebase Authentication > Settings > Authorized domains.";
    case "auth/captcha-check-failed":
      return "reCAPTCHA check failed. Reload the page and try again.";
    case "auth/missing-client-identifier":
      return "Browser blocked reCAPTCHA storage. Disable strict tracking/ad-blockers and retry.";
    case "auth/invalid-app-credential":
      return "Invalid app credential. Verify your Firebase web config and authorized domain.";
    case "auth/invalid-api-key":
      return "Invalid Firebase API key in your .env file.";
    case "auth/billing-not-enabled":
      return "Billing is not enabled. Phone OTP SMS requires Blaze pay-as-you-go for real numbers.";
    case "auth/configuration-not-found":
      return "Phone auth configuration not found. Recheck provider settings in Firebase Authentication.";
    case "auth/quota-exceeded":
      return "SMS quota exceeded for today. Try later or add test numbers in Firebase.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    case "auth/network-request-failed":
      return "Network blocked request. Check internet/VPN/ad-blocker and retry.";
    case "auth/code-expired":
      return "OTP expired. Request a new OTP.";
    case "auth/invalid-verification-code":
      return "Invalid OTP code. Enter the latest code sent to your phone.";
    case "auth/session-expired":
      return "OTP session expired. Send OTP again.";
    default:
      return `${code || "auth/unknown"}: ${
        error?.message || "Phone authentication failed."
      }`;
  }
};

const LoginPage = () => {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showPhoneSection, setShowPhoneSection] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState("");

  const authReady = hasFirebaseConfig && auth;

  useEffect(() => {
    if (!auth) return undefined;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/", { replace: true });
      }
    });

    return () => {
      unsubscribe();
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, [navigate]);

  const setupRecaptcha = async () => {
    if (!auth) return null;
    if (recaptchaRef.current) return recaptchaRef.current;

    const verifier = new RecaptchaVerifier(auth, "recaptcha-container", {
      size: "normal",
      theme: "dark",
      callback: () => {},
    });

    await verifier.render();
    recaptchaRef.current = verifier;
    return verifier;
  };

  const handleGoogleLogin = async () => {
    if (!authReady || !googleProvider) {
      setStatus("Firebase is not configured. Add env keys first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("");
      await signInWithPopup(auth, googleProvider);
      navigate("/", { replace: true });
    } catch (error) {
      setStatus(error.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event) => {
    event.preventDefault();

    if (!authReady) {
      setStatus("Firebase is not configured. Add env keys first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("");

      if (mode === "signup") {
        const credential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        if (name.trim()) {
          await updateProfile(credential.user, { displayName: name.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      navigate("/", { replace: true });
    } catch (error) {
      setStatus(error.message || "Email/password auth failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!authReady) {
      setStatus("Firebase is not configured. Add env keys first.");
      return;
    }

    const normalizedPhone = normalizePhoneNumber(phone);

    if (!/^\+[1-9]\d{7,14}$/.test(normalizedPhone)) {
      setStatus("Phone must be in E.164 format, e.g. +91XXXXXXXXXX.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("");
      setPhone(normalizedPhone);

      const verifier = await setupRecaptcha();
      const result = await signInWithPhoneNumber(auth, normalizedPhone, verifier);

      setConfirmationResult(result);
      setStatus("OTP sent. Enter the code below.");
    } catch (error) {
      setStatus(mapFirebasePhoneError(error));
      if (recaptchaRef.current && error?.code !== "auth/too-many-requests") {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setStatus("Send OTP first.");
      return;
    }

    try {
      setIsLoading(true);
      setStatus("");
      await confirmationResult.confirm(otp);
      navigate("/", { replace: true });
    } catch (error) {
      setStatus(mapFirebasePhoneError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden bg-[#0f0f10] px-4 py-10 text-white">
      <div className="mx-auto mt-6 w-full max-w-[430px] rounded-2xl border border-white/10 bg-[#17181b] p-6 shadow-2xl">
        <div className="flex justify-end">
          <Link
            to="/"
            className="rounded-full p-1 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            aria-label="Close login"
          >
            <IoClose size={22} />
          </Link>
        </div>

        <h1 className="mt-2 text-center font-general text-4xl font-medium">
          Log in or sign up
        </h1>
        <p className="mt-4 text-center font-circular-web text-white/80">
          You&apos;ll get smarter responses and can upload files, images, and
          more.
        </p>

        <div className="mt-8 space-y-3">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className={providerButtonClass}
          >
            <FcGoogle className="text-lg" />
            Continue with Google
          </button>

          <button
            type="button"
            onClick={() => setStatus("Apple login is not configured.")}
            className={providerButtonClass}
          >
            <FaApple className="text-lg" />
            Continue with Apple
          </button>

          <button
            type="button"
            onClick={() => setStatus("Microsoft login is not configured.")}
            className={providerButtonClass}
          >
            <BsMicrosoft className="text-lg" />
            Continue with Microsoft
          </button>

          <button
            type="button"
            onClick={() => setShowPhoneSection((prev) => !prev)}
            className={providerButtonClass}
          >
            <FiPhone className="text-lg" />
            Continue with phone
          </button>
        </div>

        {showPhoneSection && (
          <div className="mt-4 space-y-3 rounded-xl border border-white/10 p-3">
            <input
              type="tel"
              placeholder="+91XXXXXXXXXX"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className={inputClass}
            />
            <p className="px-1 text-xs text-white/60">
              Use full number with country code. Example: +91XXXXXXXXXX.
              Spark plan can only use Firebase test numbers for phone auth.
            </p>

            <button
              type="button"
              onClick={handleSendOtp}
              disabled={isLoading}
              className="w-full rounded-full bg-white/90 py-3 text-black transition-opacity disabled:opacity-60"
            >
              Send OTP
            </button>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              className={inputClass}
            />

            <button
              type="button"
              onClick={handleVerifyOtp}
              disabled={isLoading}
              className="w-full rounded-full bg-white/90 py-3 text-black transition-opacity disabled:opacity-60"
            >
              Verify OTP
            </button>

            <div id="recaptcha-container" className="mt-1" />
          </div>
        )}

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/20" />
          <span className="text-white/60">OR</span>
          <div className="h-px flex-1 bg-white/20" />
        </div>

        <form className="space-y-3" onSubmit={handleEmailAuth}>
          {mode === "signup" && (
            <input
              type="text"
              placeholder="Full name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className={inputClass}
            />
          )}

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className={inputClass}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className={inputClass}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="mt-2 w-full rounded-full bg-white py-4 font-general text-black transition-opacity disabled:opacity-60"
          >
            Continue
          </button>
        </form>

        <button
          type="button"
          onClick={() => setMode((prev) => (prev === "login" ? "signup" : "login"))}
          className="mt-4 w-full text-center text-white/80 underline underline-offset-2"
        >
          {mode === "login"
            ? "Need an account? Sign up with email"
            : "Already have an account? Log in"}
        </button>

        <p className="mt-4 min-h-6 text-center text-sm text-blue-200">{status}</p>
        {!hasFirebaseConfig && (
          <p className="text-center text-sm text-red-300">
            Missing Firebase env config. Add keys in `.env`.
          </p>
        )}

      </div>
    </main>
  );
};

export default LoginPage;
