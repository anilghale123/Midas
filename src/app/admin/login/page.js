"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const t = useT();
  const callbackUrl = search.get("callbackUrl") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        toast.error(t("auth.invalidCredentials"));
        return;
      }
      toast.success(t("auth.welcomeBack"));
      router.replace(callbackUrl);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-secondary px-4">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-card border border-border bg-surface p-6 shadow-card"
      >
        <h1 className="text-xl font-bold text-text-primary">{t("admin.login.title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("admin.login.subtitle")}</p>

        <label className="mt-5 block text-sm font-medium text-text-primary">
          {t("auth.email")}
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
            disabled={loading}
          />
        </label>

        <label className="mt-4 block text-sm font-medium text-text-primary">
          {t("auth.password")}
          <div className="relative mt-1">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full rounded-input border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              aria-label={showPassword ? t("actions.hidePassword") : t("actions.showPassword")}
              className="absolute inset-y-0 right-0 flex items-center px-3 text-text-muted hover:text-text-primary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-btn bg-brand px-4 py-2 text-sm font-semibold text-white shadow-brand hover:bg-brand-dark transition-colors duration-fast disabled:opacity-60"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {t("actions.signIn")}
        </button>
      </form>
    </div>
  );
}
