"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth-service";
import { useAuthStore } from "@/stores/use-auth-store";
import { toastError, toastSuccess } from "@/lib/toast";
import {MailIcon } from "lucide-react"

export default function LoginPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberSignature, setRememberSignature] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgroundTransform, setBackgroundTransform] = useState("scale(1.05) translate(0px, 0px)");

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 20;
      setBackgroundTransform(`scale(1.05) translate(${x}px, ${y}px)`);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const toggleIcon = useMemo(() => (showPassword ? "visibility" : "visibility_off"), [showPassword]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!email || !password) {
      toastError("Email and password are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await login(email, password);

      if (!data?.token) {
        toastError("Invalid credentials.");
        return;
      }

      setToken(data.token);
      setUser(data.user || null);

      if (!rememberSignature && typeof window !== "undefined") {
        try {
          sessionStorage.setItem("memorize_session_login", "true");
        } catch {
          // Ignore browser storage errors.
        }
      }

      toastSuccess("Connection established.", {
        description: "Welcome back to your neural map.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toastError(error?.response?.data?.message || "Login failed.", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface-void text-text-primary selection:bg-primary/30 selection:text-primary">
      <div
        id="kinetic-bg"
        className="absolute inset-0 z-0 scale-105 bg-cover bg-center opacity-40 transition-transform duration-1000 ease-out"
        style={{
          backgroundImage: "url('/images/auth-neural-bg.jpg')",
          transform: backgroundTransform,
        }}
      />

      <div className="absolute inset-0 z-0 bg-linear-to-t from-surface-void via-surface-void/80 to-transparent" />
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />

      <header className="relative z-10 flex w-full items-center justify-between px-4 py-6 md:px-10">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-2xl text-primary">neurology</span>
          <span className="font-display text-2xl font-bold tracking-tight text-text-primary">SciMastery</span>
        </div>

        <Link
          href="/"
          className="font-data-mono text-data-mono flex items-center gap-1 text-text-secondary transition-colors hover:text-primary"
        >
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Return
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center p-4 md:p-10">
        <div className="group relative w-full max-w-105 overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-overlay/60 p-6 shadow-[0_20px_50px_rgba(6,10,9,0.8),0_0_20px_rgba(107,216,203,0.1)] backdrop-blur-xl sm:p-8 md:p-10">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-primary/10 blur-3xl transition-all duration-700 group-hover:bg-primary/20" />

          <div className="relative z-10">
            <div className="mb-6 text-center">
              <h1 className="font-display text-headline-lg-mobile md:text-headline-lg mb-1 text-text-primary">Initialize Link</h1>
              <p className="font-body-sm text-body-sm text-text-secondary">Authenticate to access your neural map.</p>
            </div>

            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="space-y-1">
                <label
                  className="font-data-mono text-data-mono ml-1 block uppercase tracking-wider text-text-secondary"
                  htmlFor="email"
                >
                  Identity Protocol (Email)
                </label>
                <div className="relative transition-shadow focus-within:shadow-[0_0_12px_rgba(107,216,203,0.15)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    {/* <span className="material-symbols-outlined text-outline">alternate_email</span> */}
                    <MailIcon className="h-5 w-5 text-outline" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="user@scimastery.edu"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="font-body-base text-body-base w-full rounded-lg border border-outline-variant bg-surface-base py-2.5 pl-12 pr-3 text-text-primary placeholder:text-outline/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label
                  className="font-data-mono text-data-mono ml-1 block uppercase tracking-wider text-text-secondary"
                  htmlFor="password"
                >
                  Access Key (Password)
                </label>
                <div className="relative transition-shadow focus-within:shadow-[0_0_12px_rgba(107,216,203,0.15)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="material-symbols-outlined text-outline">key</span>
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="********"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="font-body-base text-body-base w-full rounded-lg border border-outline-variant bg-surface-base py-2.5 pl-12 pr-12 text-text-primary placeholder:text-outline/50 transition-all focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <button
                    id="toggle-password"
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-outline transition-colors hover:text-primary focus:outline-none"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <span className="material-symbols-outlined" id="toggle-icon">
                      {toggleIcon}
                    </span>
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2 pb-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                <label className="flex cursor-pointer items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    checked={rememberSignature}
                    onChange={(event) => setRememberSignature(event.target.checked)}
                    className="h-4 w-4 cursor-pointer rounded border-outline-variant bg-surface-base text-primary transition-colors focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-surface-overlay"
                  />
                  <span className="font-data-mono text-data-mono ml-2 select-none text-text-secondary">
                    Remember Neural Signature
                  </span>
                </label>

                <button
                  type="button"
                  className="font-data-mono text-data-mono text-left text-primary transition-all hover:text-primary-fixed-dim hover:underline"
                  onClick={() => toastError("Recovery flow is not configured yet.")}
                >
                  Recover Key
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="font-data-mono text-data-mono flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 font-bold uppercase tracking-wider text-on-primary shadow-[0_0_16px_rgba(107,216,203,0.1)] transition-all hover:bg-secondary hover:shadow-[0_0_24px_rgba(107,216,203,0.2)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {loading ? "Establishing..." : "Establish Connection"}
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-body-sm text-body-sm text-text-secondary">
                Unregistered entity?{" "}
                <Link href="/signup" className="text-primary transition-colors hover:text-secondary hover:underline">
                  Request Access
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
