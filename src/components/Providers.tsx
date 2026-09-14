"use client";

import React, { useRef } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store/store";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { LocaleProvider } from "@/contexts/LocaleContext";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const storeRef = useRef(store);
    if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = store;
  }

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        <LocaleProvider>
          <TooltipProvider>
            <Sonner />
            {children}
          </TooltipProvider>
        </LocaleProvider>
      </PersistGate>
    </Provider>
  );
};
