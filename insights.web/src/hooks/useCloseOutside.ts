import React, { useState, useRef, useEffect } from "react";

export default function useCloseOutside(
  ref: React.RefObject<HTMLElement>,
  set: React.Dispatch<React.SetStateAction<boolean>>,
): void {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!ref.current.contains(event.target as Node)) {
        set(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, set]);
}
