"use client";

import React, { useState, useEffect, useRef } from "react";
import { Keyboard } from "lucide-react";
import CustomKeyboard from "@/features/shared/components/custom-keyboard";
import { useKeyboard } from "@/features/shared/components/keyboard-context";

export default function FloatingKeyboardWidget() {
  const [activeInputId, setActiveInputId] = useState<string | null>(null);
  const lastFocusedInputRef = useRef<HTMLElement | null>(null);

  const { showKeyboard, setShowKeyboard } = useKeyboard();

  // Track the currently focused input/textarea
  // Update activeInputId when focus changes, especially when keyboard is open
  // useEffect(() => {
  //   const handleFocus = (e: FocusEvent) => {
  //     const target = e.target as HTMLElement;
  //     if (
  //       target &&
  //       (target.tagName === "INPUT" || target.tagName === "TEXTAREA")
  //     ) {
  //       lastFocusedInputRef.current = target;
  //       const id = target.id || target.getAttribute("id");
  //       if (id) {
  //         setActiveInputId(id);
  //       } else {
  //         // Generate a temporary ID if none exists
  //         const tempId = `temp-input-${Date.now()}`;
  //         target.setAttribute("id", tempId);
  //         setActiveInputId(tempId);
  //       }
  //     }
  //   };

  //   document.addEventListener("focusin", handleFocus);

  //   return () => {
  //     document.removeEventListener("focusin", handleFocus);
  //   };
  // }, [showKeyboard]);

  // When opening keyboard, check for currently focused input
  // const handleToggleKeyboard = () => {
  //   if (!showKeyboard) {
  //     // Check if there's currently a focused input
  //     const activeElement = document.activeElement as HTMLElement;
  //     if (
  //       activeElement &&
  //       (activeElement.tagName === "INPUT" ||
  //         activeElement.tagName === "TEXTAREA")
  //     ) {
  //       const id = activeElement.id || activeElement.getAttribute("id");
  //       if (id) {
  //         setActiveInputId(id);
  //       } else {
  //         const tempId = `temp-input-${Date.now()}`;
  //         activeElement.setAttribute("id", tempId);
  //         setActiveInputId(tempId);
  //       }
  //       lastFocusedInputRef.current = activeElement;
  //     } else if (lastFocusedInputRef.current) {
  //       // Use the last focused input if available
  //       const lastInput = lastFocusedInputRef.current;
  //       const id = lastInput.id || lastInput.getAttribute("id");
  //       if (id) {
  //         setActiveInputId(id);
  //       }
  //     }
  //   }
  //   setShowKeyboard(!showKeyboard);
  // };

  // Keyboard only closes when user explicitly clicks the close button
  // No click-outside handler to match the behavior of the keyboard button in word details page

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        type="button"
        onClick={() => setShowKeyboard(!showKeyboard)}
        className={`${showKeyboard && "max-md:hidden"} floating-keyboard-toggle fixed bottom-6 left-6 md:left-auto md:right-6 z-999 flex items-center justify-center w-14 h-14 rounded-full bg-foreground text-[#1e1e1e] shadow-lg hover:bg-[#f0d4a0] transition-all duration-200 hover:scale-110 active:scale-95`}
        aria-label="Toggle virtual keyboard"
        title="Virtual Keyboard"
      >
        <Keyboard className="h-6 w-6" />
      </button>

      <CustomKeyboard
        // isOpen={showKeyboard}
        value=""
        handleChange={() => {}}
        onClose={() => {
          setShowKeyboard(false);
          setActiveInputId(null);
        }}
      />

      {/* Virtual Keyboard */}
      {/* {showKeyboard && (
        <VirtualUrhoboKeyboard
          targetInputId={activeInputId || undefined}
          onClose={() => {
            setShowKeyboard(false)
            setActiveInputId(null)
          }}
        />
      )} */}
    </>
  );
}
