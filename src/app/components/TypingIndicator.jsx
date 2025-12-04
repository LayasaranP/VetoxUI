"use client";

import { useState, useEffect, useRef, useLayoutEffect } from "react";

export default function useTypingEffect(fullText, speed = 20) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!fullText) {
      setIndex(0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    let currentIndex = 0;
    const update = () => {
      setIndex(currentIndex + 1);
      currentIndex++;
      if (currentIndex < fullText.length) {
        timeoutRef.current = setTimeout(update, speed);
      } else {
        timeoutRef.current = null;
      }
    };

    update(); 

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [fullText, speed]);

  return fullText ? fullText.slice(0, index) : "";
}

export const AIBubble = ({ text }) => {
  const typed = useTypingEffect(text, 18);

  const hiddenRef = useRef(null);
  const [height, setHeight] = useState(null);

  useLayoutEffect(() => {
    if (hiddenRef.current) {
      setHeight(hiddenRef.current.offsetHeight);
    }
  }, [text]);

  return (
    <div
      style={{
        height: height ? `${height}px` : "auto",  
        overflow: "hidden",
        whiteSpace: "pre-wrap",
        position: "relative",
      }}
    >
      <div>{typed}</div>

      <div
        ref={hiddenRef}
        style={{
          position: "absolute",
          visibility: "hidden",
          whiteSpace: "pre-wrap",
          pointerEvents: "none",
          width: "100%",
          top: 0,
          left: 0,
        }}
      >
        {text}
      </div>
    </div>
  );
};