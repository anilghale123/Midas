"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, X, Send, Loader2, Bot, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

const DISCLAIMER =
  "This bot provides general information only. For investment advice, speak to a SEBON-registered advisor.";

const SUGGESTIONS = [
  "How do I open a NEPSE trading account?",
  "What documents do I need for KYC?",
  "What services does MIDAS offer?",
  "Where are your offices located?",
];

const WELCOME_MESSAGE = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text: "Hi! I'm the MIDAS Assistant. I can help you with information about our services, KYC, FAQs, and notices. How can I help today?",
    },
  ],
};

function messageText(msg) {
  if (!msg) return "";
  if (Array.isArray(msg.parts)) {
    return msg.parts
      .filter((p) => p?.type === "text" && typeof p.text === "string")
      .map((p) => p.text)
      .join("");
  }
  // Fallback for older shapes.
  if (typeof msg.content === "string") return msg.content;
  return "";
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Stable transport instance.
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    []
  );

  const {
    messages,
    sendMessage,
    status,
    error,
    stop,
  } = useChat({
    transport,
    messages: [WELCOME_MESSAGE],
  });

  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open]);

  function submit(text) {
    const trimmed = (text ?? input).trim();
    if (!trimmed || isBusy) return;
    sendMessage({ text: trimmed });
    setInput("");
  }

  function onFormSubmit(e) {
    e.preventDefault();
    submit();
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Open MIDAS Assistant"}
        aria-expanded={open}
        className={cn(
          "fixed bottom-6 right-6 z-toast inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-brand transition-all duration-slow",
          open
            ? "bg-text-primary hover:bg-text-secondary scale-95"
            : "bg-brand hover:bg-brand-dark hover:scale-105 animate-pulse-brand"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div
          role="dialog"
          aria-label="MIDAS Assistant"
          className={cn(
            "fixed z-toast flex flex-col overflow-hidden border border-border bg-surface shadow-lg animate-scale-in",
            "inset-x-0 bottom-24 mx-3 max-h-[min(80vh,640px)] rounded-card",
            "sm:inset-x-auto sm:bottom-24 sm:right-6 sm:mx-0 sm:w-96"
          )}
        >
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-border bg-surface-secondary px-4 py-3">
            <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand/15 text-brand">
              <Bot className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-text-primary">
                MIDAS Assistant
              </p>
              <p className="truncate text-xs text-text-secondary">
                General information · MIDAS Stock Broking
              </p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((m, i) => (
              <Message key={m.id ?? i} role={m.role} text={messageText(m)} />
            ))}

            {messages.length <= 1 && !isBusy && (
              <div className="space-y-2 pt-1">
                <p className="text-xs font-medium text-text-muted">Try asking</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => submit(s)}
                      className="rounded-badge border border-border bg-surface px-3 py-1 text-xs text-text-secondary hover:border-brand hover:text-brand transition-colors duration-fast"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {isBusy && <TypingIndicator />}

            {error && (
              <div className="flex items-start gap-2 rounded-card border border-danger/30 bg-danger-light p-3 text-xs text-danger-text">
                <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
                <span>
                  Something went wrong. Please try again, or contact{" "}
                  <a href="mailto:inquiry@midasstock.com.np" className="underline">
                    inquiry@midasstock.com.np
                  </a>
                  .
                </span>
              </div>
            )}
          </div>

          {/* Disclaimer */}
          <div className="border-t border-border bg-warning-light/40 px-4 py-2 text-[11px] leading-snug text-warning-text">
            <span className="font-semibold">Disclaimer: </span>
            {DISCLAIMER}
          </div>

          {/* Input */}
          <form
            onSubmit={onFormSubmit}
            className="flex items-center gap-2 border-t border-border bg-surface px-3 py-3"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about MIDAS services, KYC, notices…"
              disabled={isBusy}
              maxLength={500}
              className="flex-1 rounded-input border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30 disabled:opacity-60"
            />
            {isBusy ? (
              <button
                type="button"
                onClick={() => stop()}
                aria-label="Stop generating"
                className="inline-flex h-9 w-9 items-center justify-center rounded-btn bg-surface-secondary text-text-secondary hover:bg-surface-tertiary transition-colors duration-fast"
              >
                <Loader2 className="h-4 w-4 animate-spin" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send message"
                className="inline-flex h-9 w-9 items-center justify-center rounded-btn bg-brand text-white hover:bg-brand-dark transition-colors duration-fast disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>
      )}
    </>
  );
}

function Message({ role, text }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] rounded-card px-3 py-2 text-sm whitespace-pre-wrap leading-relaxed animate-fade-up",
          isUser
            ? "bg-brand text-white"
            : "bg-surface-secondary text-text-primary border border-border"
        )}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="inline-flex items-center gap-1 rounded-card border border-border bg-surface-secondary px-3 py-2">
        <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-text-muted" />
      </div>
    </div>
  );
}
