"use client";

import React, { useState } from "react";
import SignInPage from "../auth/SignIn.jsx";
import SignUpPage from "../auth/SignUp.jsx";

export default function AuthPage() {
  const [mode, setMode] = useState("login"); 

  return (
    <div>
      {mode === "login" ? (
        <SignInPage switchToSignUp={() => setMode("signup")} />
      ) : (
        <SignUpPage switchToSignIn={() => setMode("login")} />
      )}
    </div>
  );
}
