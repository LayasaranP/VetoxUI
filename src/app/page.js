"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthProvider from "./context/authContext"; 
import { useSelector, useDispatch } from "react-redux";
import { signOut, signIn } from "./store/userSlice";

const Page = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("vetox_user");
    const savedTime = localStorage.getItem("vetox_user_time");

    const now = Date.now();
    const SESSION_LIMIT = 2 * 24 * 60 * 60 * 1000;

    if (savedTime && now - Number(savedTime) > SESSION_LIMIT) {
      localStorage.removeItem("vetox_user");
      localStorage.removeItem("vetox_user_time");
      dispatch(signOut());
      setIsLoading(false);
      return;
    }

    if (savedUser && !isLoggedIn) {
      try {
        const parsed = JSON.parse(savedUser);

        if (parsed && parsed.id) {
          dispatch(
            signIn({
              user_id: parsed.id,
              name: parsed.name,
              email: parsed.email,
              isLoggedIn: true,
            })
          );
        }
      } catch (err) {
        localStorage.removeItem("vetox_user");
        localStorage.removeItem("vetox_user_time");
      }
    }

    setIsLoading(false);
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn) {
      router.replace("/");
      return;
    }

    localStorage.setItem("vetox_user_time", Date.now().toString());

    router.replace("/chat");
  }, [isLoggedIn, isLoading, router]);

  if (isLoading) return null;

  return <AuthProvider />;
};

export default Page;
