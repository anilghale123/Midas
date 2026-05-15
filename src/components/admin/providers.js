"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function AdminProviders({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          className: "animate-toast-in font-sans text-sm",
          style: {
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--color-border)",
          },
        }}
      />
    </SessionProvider>
  );
}
