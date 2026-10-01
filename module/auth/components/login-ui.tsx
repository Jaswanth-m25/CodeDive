"use client";

import { signIn } from "@/lib/auth-client";
import { useState } from "react";
import React from "react";

const LoginUI = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleGithubSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn.social({
        provider: "github",
      });
    } catch (error) {
      console.error("Error during GitHub sign-in:", error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-[#f4e7c5]/[0.035] blur-[140px]" />

        <div className="absolute -bottom-40 right-0 h-[450px] w-[450px] rounded-full bg-[#f4e7c5]/[0.025] blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      <div className="relative min-h-screen flex flex-col">

        {/* HEADER */}
        <header className="flex items-center justify-between px-7 py-7 sm:px-10 lg:px-14">

          <div className="flex items-center gap-3">

            {/* <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4e7c5]">
              <div className="h-3 w-3 rounded-full bg-[#090909]" />
            </div> */}

            <span className="text-[2.15rem] font-black tracking-[-0.065em] leading-none">
  <span className="text-white">Code</span>
  <span className="text-[#f4e7c5]">Dive</span>
</span>

          </div>

          <div className="hidden sm:block text-xs tracking-[0.2em] text-[#6b7280] uppercase">
            AI Code Review
          </div>

        </header>

        {/* MAIN */}
        <main className="flex flex-1 items-center px-7 pb-10 sm:px-10 lg:px-14">

          <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">

            {/* LEFT */}
            <section className="max-w-3xl">

              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#2b2b2b] bg-[#111111]/80 px-3.5 py-2 text-xs font-medium text-[#9ca3af] backdrop-blur">

                <span className="h-1.5 w-1.5 rounded-full bg-[#f4e7c5]" />

                AI-POWERED CODE REVIEWS

              </div>

              <h1 className="text-[3.4rem] font-bold leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-[5.6rem]">

                Review Code Smarter
                <br />

                Fix Issues Faster
                <br />

                <span className="text-[#f4e7c5]">
                  Build Better
                </span>

                {/* <span className="text-[#6b7280]">
                  {" "}Build Better.
                </span> */}

              </h1>

              <p className="mt-8 max-w-xl text-base leading-7 text-[#8d949e] sm:text-lg">

                Supercharge your development workflow with intelligent
                AI-powered code reviews that help you find bugs, security
                issues, and improvements before they reach production.

              </p>

              {/* Small feature indicators */}
              <div className="mt-10 flex flex-wrap gap-3">

                <div className="rounded-lg border border-[#252525] bg-[#101010] px-4 py-3 text-sm text-[#a1a1aa]">
                  Automated Reviews
                </div>

                <div className="rounded-lg border border-[#252525] bg-[#101010] px-4 py-3 text-sm text-[#a1a1aa]">
                  GitHub Integration
                </div>

                <div className="rounded-lg border border-[#252525] bg-[#101010] px-4 py-3 text-sm text-[#a1a1aa]">
                  AI Analysis
                </div>

              </div>

            </section>

            {/* RIGHT */}
            <section className="flex justify-center lg:justify-end">

              <div className="w-full max-w-[430px]">

                {/* LOGIN CARD */}
                <div className="rounded-2xl border border-[#292929] bg-[#111111]/95 p-7 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-9">

                  {/* Card heading */}
                  <div className="mb-8">

                    <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-[#6b7280]">
                      Welcome back
                    </p>

                    <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                      Sign in to CodeDive
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-[#7d8490]">
                      Connect your GitHub account to continue.
                    </p>

                  </div>

                  {/* GitHub Button */}
                  <button
                    onClick={handleGithubSignIn}
                    disabled={isLoading}
                    className="
                      group
                      flex
                      h-14
                      w-full
                      items-center
                      justify-center
                      gap-3
                      rounded-xl
                      bg-[#f4e7c5]
                      text-[#111111]
                      text-base
                      font-semibold
                      transition-all
                      duration-200
                      hover:bg-[#fff1c9]
                      hover:-translate-y-0.5
                      hover:shadow-[0_10px_35px_rgba(244,231,197,0.12)]
                      active:translate-y-0
                      disabled:cursor-not-allowed
                      disabled:opacity-60
                    "
                  >

                    <svg
                      width="21"
                      height="21"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z" />
                    </svg>

                    <span>
                      {isLoading ? "Connecting..." : "Continue with GitHub"}
                    </span>

                  </button>

                  {/* Sign Up */}
{/* Sign Up */}
<p className="mt-7 text-center text-sm text-[#777f8b]">
  New to CodeDive?{" "}
  <button
    onClick={handleGithubSignIn}
    disabled={isLoading}
    className="font-semibold text-[#f4e7c5] transition-colors hover:text-[#fff1c9] hover:underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-60"
  >
    Sign Up with GitHub
  </button>
</p>

                  {/* Self Hosted */}
                  <div className="mt-4 text-center">

                    <button className="text-sm font-medium text-[#777f8b] transition-colors hover:text-white">
                      Self-Hosted Services
                    </button>

                  </div>

                </div>

                {/* Footer */}
                <div className="mt-7 flex items-center justify-center gap-4 text-xs text-[#555b64]">

                  <button className="transition-colors hover:text-[#9ca3af]">
                    Terms of Use
                  </button>

                  <span className="text-[#33363b]">
                    •
                  </span>

                  <button className="transition-colors hover:text-[#9ca3af]">
                    Privacy Policy
                  </button>

                </div>

              </div>

            </section>

          </div>

        </main>

      </div>

    </div>
  );
};

export default LoginUI;