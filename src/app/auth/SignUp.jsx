"use client";

import React, { useState } from "react";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import AuthCard from '../components/AuthCard.jsx';
import fetchVetoxData from '../services/VetoxServices.js';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { signIn } from '../store/userSlice';

const SignUpPage = ({ switchToSignIn }) => {

  const dispatch = useDispatch();

  const [signUpData, setSignUpData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  function handleChange(e) {
    setSignUpData({
      ...signUpData,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await fetchVetoxData("create_user", "POST", signUpData);

      if (res.message === "User created successfully") {
        dispatch(signIn({
          user_id: res.user.id,
          name: res.user.name,
          email: res.user.email,
          isLoggedIn: true
        }));
        
        if (typeof window !== "undefined") {
          localStorage.setItem("vetox_user", JSON.stringify(res.user));
        }

        router.push('/chat');
      } else {
        setErrorMessage(res.message || "Sign up failed. Try again.");
      }
    } catch (err) {
      setErrorMessage("Check your details and try again.");
    }
  }

  return (
    <AuthCard
      title="Create Account"
      subtitle="Start your journey with Vetox AI today"
    >
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Error Message */}
        {errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
            <AlertCircle size={16} />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div className="relative group">
          <User className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400" />
          <input
            type="text"
            placeholder="Full Name"
            name="name"
            value={signUpData.name}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                       text-slate-200 focus:border-indigo-500/50 focus:ring-1 
                       focus:ring-indigo-500/50 placeholder:text-slate-600"
          />
        </div>

        {/* Email */}
        <div className="relative group">
          <Mail className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400" />
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={signUpData.email}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                       text-slate-200 focus:border-indigo-500/50 focus:ring-1 
                       focus:ring-indigo-500/50 placeholder:text-slate-600"
          />
        </div>

        {/* Password */}
        <div className="relative group">
          <Lock className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-indigo-400" />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={signUpData.password}
            onChange={handleChange}
            className="w-full bg-slate-950/50 border border-slate-800 rounded-xl py-3 pl-12 pr-4 
                       text-slate-200 focus:border-indigo-500/50 focus:ring-1 
                       focus:ring-indigo-500/50 placeholder:text-slate-600"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 
                     text-white font-semibold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 
                     flex items-center justify-center gap-2"
        >
          <span>Create Account</span>
          <ArrowRight size={18} />
        </button>
      </form>

      {/* Footer */}
      <div className="text-center text-sm text-slate-400 mt-4">
        Already have an account?{" "}
        <button
          onClick={switchToSignIn}
          className="text-indigo-400 hover:text-indigo-300 font-semibold"
        >
          Sign In
        </button>
      </div>

    </AuthCard>
  );
};

export default SignUpPage;
