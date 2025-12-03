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
        console.error("Invalid user in localStorage:", err);
        localStorage.removeItem("vetox_user");
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

    router.replace("/chat");
    
    const timer = setTimeout(() => {
      dispatch(signOut());
      localStorage.removeItem("vetox_user");
      router.replace("/");
    }, 2 * 60 * 1000); 

    return () => {
      clearTimeout(timer);
    }
  }, [isLoggedIn, isLoading, dispatch, router]);

  if (isLoading) {
    return null;
  }

  return <AuthProvider />;
};

export default Page;