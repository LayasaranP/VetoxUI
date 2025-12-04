"use client";

import React, { useState } from "react";
import { Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import AuthCard from "../components/AuthCard.jsx";
import fetchVetoxData from "../services/VetoxServices.js";
import { useRouter } from 'next/navigation';
// import Oauth from "./Oauth.jsx";
import { useDispatch } from 'react-redux';
import { signIn } from '../store/userSlice';

const SignInPage = ({ switchToSignUp }) => {

  const router = useRouter();

  const dispatch = useDispatch();

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(e) {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetchVetoxData("verify_user", "POST", loginData);
      if (res.message=="Login successful") {
        dispatch(signIn({
          user_id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          isLoggedIn: true
        }));

        if (typeof window !== "undefined") {
                localStorage.setItem("vetox_user", JSON.stringify(res.user));
                localStorage.setItem("vetox_user_time", String(Date.now()));
        }

        router.push('/chat');
      } else {
        setErrorMessage("SignIn failed. Check your details and try again.");
      }
    } catch (err) {
      setErrorMessage(err.message)
    }
  }

  const handleForgotPassword = () => {
    router.push("/forgot_password")
  }

  return (
    <AuthCard title="Welcome Back" subtitle="Sign in to access your Vetox workspace">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email */}
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400" />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={loginData.email}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 
                       focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-slate-600"
          />
        </div>

        {/* Password */}
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={loginData.password}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 text-slate-200 
                       focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 placeholder:text-slate-600"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-indigo-400 hover:text-indigo-300"
          >
            Forgot Password?
          </button>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                     text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 
                     flex items-center justify-center gap-2"
        >
          <span>Sign In</span>
          <ArrowRight size={18} />
        </button>
        </form>

        <div className="text-center text-sm text-slate-400 mt-4">
          Don&apos;t have an account?{" "}
          <button onClick={switchToSignUp} className="text-indigo-400 hover:text-indigo-300 font-semibold">
            Sign Up
          </button>
        </div>
        {/* <Oauth /> */}
    </AuthCard>
  );
};

export default SignInPage;
