"use client";

import React, { useState } from "react";
import AuthCard from "../components/AuthCard";
import { Mail, ArrowRight, Lock, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [status, setStatus] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const router = useRouter();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleVerifyEmail = async () => {
    setErrorMessage("");

    try {
      const res = await fetch(`${apiUrl}/forgot_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(false);
        setErrorMessage(data.message || "Something went wrong.");
        return;
      }

      setStatus(true);
    } catch (err) {
      setErrorMessage("Network error. Try again.");
    }
  };

  const handleResetPassword = async () => {
    setErrorMessage("");

    try {
      const res = await fetch(`${apiUrl}/forgot_password/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.message || "Password reset failed.");
        return;
      }

      router.push("/")
    } catch (err) {
      setErrorMessage("Network error. Try again.");
    }
  };

  return (
    <AuthCard title="Forgot Password" subtitle="Enter your email account to reset password">
      
      {errorMessage && (
        <div className="flex items-center gap-3 mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
          <AlertCircle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-4">

        {!status && (
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                         text-slate-200 focus:border-indigo-500/50 focus:ring-1"
            />
          </div>
        )}

        {status && (
          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-slate-500" />
            <input
              type="email"
              value={email}
              readOnly
              className="w-full bg-slate-900/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                         text-slate-500 cursor-not-allowed"
            />

            <div className="relative mt-4 mb-3">
              <Lock className="absolute left-4 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                           text-slate-200 focus:border-indigo-500/50 focus:ring-1"
              />
            </div>
          </div>
        )}

        {!status ? (
          <button
            type="submit"
            onClick={handleVerifyEmail}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl flex justify-center items-center gap-2"
          >
            Submit now <ArrowRight />
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleResetPassword}
            className="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white py-3.5 rounded-xl flex justify-center items-center gap-2"
          >
            Reset Password <ArrowRight />
          </button>
        )}
      </div>
    </AuthCard>
  );
};

export default ForgotPassword;
