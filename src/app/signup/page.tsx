"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signup } from "@/services/auth-service";
import { useAuthStore } from "@/stores/use-auth-store";
import { toastError, toastSuccess } from "@/lib/toast";

export default function SignupPage() {
  const router = useRouter();
  const setToken = useAuthStore((s) => s.setToken);
  const setUser = useAuthStore((s) => s.setUser);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [backgroundTransform, setBackgroundTransform] = useState("scale(1.05) translate(0px, 0px)");

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20;
      const y = (event.clientY / window.innerHeight - 0.5) * 20;
      setBackgroundTransform(`scale(1.05) translate(${x}px, ${y}px)`);
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  const passwordIcon = useMemo(() => (showPassword ? "visibility" : "visibility_off"), [showPassword]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setAvatarPreview(typeof reader.result === "string" ? reader.result : null);
    };
    reader.readAsDataURL(file);
  };

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!displayName || !email || !password) {
      toastError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const data = await signup({ displayName, email, password });

      if (!data?.token) {
        toastError("Signup failed.");
        return;
      }

      setToken(data.token);
      setUser(data.user || null);

      toastSuccess("Account initialized.", {
        description: "Welcome to Memorize.",
      });
      router.push("/dashboard");
    } catch (error: any) {
      toastError(error?.response?.data?.message || "Signup failed.", {
        description: "Please review the form and try again.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen bg-surface-void font-body-base text-on-surface md:grid md:grid-cols-2">
      <div className="relative hidden overflow-hidden md:block md:min-h-screen">
        <Image
          src="/images/signup-neural-bg.jpg"
          alt="Cybernetic neural node"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-linear-to-r from-surface-void/40 to-surface-void/90" />
        <div className="absolute inset-0 bg-surface-void/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col justify-between bg-surface-void px-4 py-4 md:px-10 md:py-6">
        <header className="flex items-center justify-between pb-6 md:pb-0">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-2xl text-primary">neurology</span>
            <span className="font-display text-headline-lg-mobile font-extrabold tracking-tight text-text-primary md:text-headline-lg">
              Memorize
            </span>
          </div>

          <Link
            href="/login"
            className="font-data-mono text-data-mono rounded px-2 py-1 text-text-secondary transition-colors hover:text-primary"
          >
            Return to Login Protocol
          </Link>
        </header>

        <main className="flex flex-1 items-center justify-center py-6 md:py-8">
          <div className="w-full max-w-120 md:my-auto">
            <div className="mb-6 text-center md:mb-8">
              <h1 className="font-display text-display mb-2 text-text-primary tracking-tight">
                Memorize
              </h1>
              <p className="font-data-mono text-data-mono uppercase tracking-widest text-text-secondary">
                Protocol Initiation Sequence
              </p>
            </div>

            <div className="glass-panel rounded-xl border border-outline-variant/20 bg-surface-overlay/65 p-6 shadow-lg shadow-primary/5 backdrop-blur-xl md:p-8">
              <form className="space-y-5" onSubmit={onSubmit}>
                <div className="flex flex-col items-center justify-center pb-2">
                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    className="avatar-scanner group relative mb-2 flex h-24 w-24 cursor-pointer items-center justify-center rounded-full transition-transform duration-300 hover:scale-105"
                    aria-label="Select avatar"
                  >
                    <div className="avatar-scanner-inner overflow-hidden rounded-full">
                      {avatarPreview ? (
                        <Image src={avatarPreview} alt="Avatar preview" fill className="object-cover" />
                      ) : (
                        <span
                          className="material-symbols-outlined text-3xl text-primary"
                          style={{ fontVariationSettings: "'FILL' 0" }}
                        >
                          account_circle
                        </span>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      accept="image/*"
                      className="hidden"
                      id="avatarUrl"
                      name="avatarUrl"
                      type="file"
                      onChange={handleAvatarChange}
                    />
                  </button>
                  <label
                    className="font-data-mono text-data-mono cursor-pointer uppercase tracking-widest text-text-secondary transition-colors hover:text-primary"
                    htmlFor="avatarUrl"
                  >
                    Initialize Bio-Metric Data
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="block font-data-mono text-data-mono uppercase text-on-surface-variant" htmlFor="displayName">
                    Subject Designation
                  </label>
                  <div className="input-glow relative rounded border border-outline-variant bg-surface-base transition-all duration-300 focus-within:border-primary">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      badge
                    </span>
                    <input
                      className="font-body-base w-full border-none bg-transparent py-2.5 pl-10 pr-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
                      id="displayName"
                      name="displayName"
                      placeholder="e.g., Dr. Aris Thorne"
                      required
                      type="text"
                      value={displayName}
                      onChange={(event) => setDisplayName(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-data-mono text-data-mono uppercase text-on-surface-variant" htmlFor="email">
                    Comm-Link Vector
                  </label>
                  <div className="input-glow relative rounded border border-outline-variant bg-surface-base transition-all duration-300 focus-within:border-primary">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      mail
                    </span>
                    <input
                      className="font-body-base w-full border-none bg-transparent py-2.5 pl-10 pr-3 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
                      id="email"
                      name="email"
                      placeholder="vector@scimastery.net"
                      required
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block font-data-mono text-data-mono uppercase text-on-surface-variant" htmlFor="password">
                    Encryption Key
                  </label>
                  <div className="input-glow relative rounded border border-outline-variant bg-surface-base transition-all duration-300 focus-within:border-primary">
                    <span
                      className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
                      style={{ fontVariationSettings: "'FILL' 0" }}
                    >
                      key
                    </span>
                    <input
                      className="font-body-base w-full border-none bg-transparent py-2.5 pl-10 pr-10 text-on-surface placeholder:text-on-surface-variant/50 focus:ring-0"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-on-surface-variant transition-colors hover:text-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
                        {passwordIcon}
                      </span>
                    </button>
                  </div>
                </div>

                <div className="pt-2 space-y-4">
                  <button
                    className="flex w-full transform items-center justify-center gap-2 rounded bg-primary py-3 font-headline-lg-mobile text-lg text-on-primary transition-all duration-300 hover:scale-[1.02] hover:bg-primary-fixed-dim hover:shadow-[0_0_24px_rgba(107,216,203,0.4)] disabled:cursor-not-allowed disabled:opacity-70"
                    type="submit"
                    disabled={loading}
                  >
                    <span>{loading ? "Initializing..." : "Initialize Account"}</span>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      arrow_forward
                    </span>
                  </button>

                  <div className="text-center">
                    <Link
                      className="font-data-mono text-data-mono border-b border-transparent pb-0.5 text-text-secondary transition-colors duration-200 hover:border-primary hover:text-primary"
                      href="/login"
                    >
                      Return to Login Protocol
                    </Link>
                  </div>
                </div>
              </form>
            </div>

            <div className="mt-4 text-center md:mt-6">
              <p className="font-data-mono text-data-mono uppercase tracking-wider text-outline">
                Secured by SciMastery Nexus Auth
              </p>
            </div>
          </div>
        </main>

        <footer className="mt-6 flex flex-col justify-between gap-4 border-t border-outline-variant pt-4 md:mt-0 md:flex-row md:items-center md:pt-6">
          <div className="font-data-mono text-data-mono uppercase tracking-wider text-text-secondary">
            © 2024 SciMastery. Engineered for Precision.
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:justify-end md:gap-6">
            <Link href="#" className="font-body-sm text-body-sm text-text-secondary transition-colors hover:text-secondary">
              Terms of Service
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-text-secondary transition-colors hover:text-secondary">
              Privacy Policy
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-text-secondary transition-colors hover:text-secondary">
              Scientific Documentation
            </Link>
            <Link href="#" className="font-body-sm text-body-sm text-text-secondary transition-colors hover:text-secondary">
              Support
            </Link>
          </nav>
        </footer>
      </div>

      <style jsx>{`
        .glass-panel {
          background: rgba(11, 18, 16, 0.65);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border: 1px solid rgba(107, 216, 203, 0.15);
        }

        .input-glow:focus-within {
          box-shadow: 0 0 12px rgba(107, 216, 203, 0.2);
          border-color: #6bd8cb;
        }

        .avatar-scanner {
          position: relative;
          overflow: hidden;
        }

        .avatar-scanner::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(transparent, transparent, transparent, #6bd8cb);
          animation: rotate 4s linear infinite;
          opacity: 0.3;
        }

        .avatar-scanner-inner {
          position: absolute;
          inset: 2px;
          border-radius: 50%;
          background: #0b1210;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        @keyframes rotate {
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
