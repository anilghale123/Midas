"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";

export default function AdminProviders({ children }) {
  return (
    <SessionProvider>
      {children}
      <Toaster richColors position="top-right" />
    </SessionProvider>
  );
}
