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
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* LEFT SIDE */}
      <div className="w-full md:w-1/2 min-h-[45vh] md:min-h-screen flex flex-col justify-between px-8 py-8 md:px-12 lg:px-16">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#f4e7c5] flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-black" />
          </div>

          <span className="text-xl font-semibold tracking-tight">
            CodePro
          </span>
        </div>

        {/* Main Text */}
        <div className="max-w-xl mt-16 md:mt-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight">
            Cut Code Review
            <br />
            Time & Bugs in
            <br />
            Half.
            <br />
            Instantly.
          </h1>

          <p className="mt-8 text-lg md:text-xl text-gray-400 max-w-lg leading-relaxed">
            Supercharge your team to ship faster with the most advanced AI
            code reviews.
          </p>
        </div>

        {/* Empty bottom space to match design */}
        <div />
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 min-h-[55vh] md:min-h-screen flex items-center justify-center px-8 py-12 md:px-12 lg:px-20">
        <div className="w-full max-w-md">
          {/* Heading */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
              Welcome Back
            </h2>

            <p className="mt-4 text-gray-400 text-base">
              Login using the following providers:
            </p>
          </div>

          {/* GitHub Button */}
          <button
            onClick={handleGithubSignIn}
            disabled={isLoading}
            className="w-full h-16 rounded-lg bg-white text-black flex items-center justify-center gap-4 text-lg font-medium transition-all duration-200 hover:bg-gray-200 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="currentColor"
  aria-hidden="true"
>
  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.004.071 1.532 1.032 1.532 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.987 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.397.1 2.65.64.701 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.31.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.579.688.481A10.019 10.019 0 0 0 22 12.017C22 6.484 17.523 2 12 2Z"
  />
</svg>

            <span>
              {isLoading ? "Connecting..." : "GitHub"}
            </span>
          </button>

          {/* Sign Up */}
          <p className="text-center mt-10 text-gray-400">
            New to CodePro?{" "}
            <button className="text-[#f4e7c5] font-semibold hover:underline">
              Sign Up
            </button>
          </p>

          {/* Self Hosted */}
          <div className="text-center mt-5">
            <button className="text-[#f4e7c5] font-semibold hover:underline">
              Self-Hosted Services
            </button>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-800 mt-16 pt-10">
            <div className="flex items-center justify-center gap-5 text-sm text-gray-500">
              <button className="hover:text-gray-300 transition-colors">
                Terms of Use
              </button>

              <span>and</span>

              <button className="hover:text-gray-300 transition-colors">
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginUI;