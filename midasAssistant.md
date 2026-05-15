# Project: MIDAS Stock Broking - Custom RAG Chatbot Implementation

## System Role & Persona
Act as an expert Next.js frontend developer, backend engineer, and AI integration specialist. You have deep knowledge of the Vercel AI SDK, MongoDB, React, Tailwind CSS, and prompt engineering. 

## Project Context
I need to build a custom Retrieval-Augmented Generation (RAG) chatbot for "MIDAS", a SEBI-regulated stock broking platform. I already have a Next.js application with a MongoDB database that stores our platform's FAQs, Notices, and Services.

Instead of using a generic third-party widget, we are building a custom solution to ensure strict regulatory compliance, eliminate vendor lock-in, and use our exact MongoDB data as context so the bot does not hallucinate. We will use the Gemini API (via `@ai-sdk/google`) for cost-effective inference.

## Technical Stack
* **Framework:** Next.js (App Router)
* **AI SDK:** Vercel AI SDK (`ai` and `@ai-sdk/google`)
* **Database:** MongoDB (via Mongoose)
* **Styling:** Tailwind CSS
* **Language:** TypeScript

## Strict Compliance & Regulatory Rules (CRITICAL)
As a SEBI-regulated broker, the following compliance rules are non-negotiable:
1.  **No Financial Advice:** The AI must be explicitly instructed via its system prompt that it is strictly prohibited from giving personalized investment advice, stock tips, or portfolio recommendations.
2.  **Mandatory Redirection:** If a user asks for market predictions or what to buy, the AI must refuse and state: "This bot provides general information only. For personalized investment advice, please speak to a SEBI-registered advisor."
3.  **UI Disclaimer:** The frontend chat widget must include a hardcoded, highly visible text disclaimer: "This bot provides general information only. For investment advice, speak to a SEBI-registered advisor."

## Required Deliverables

Please write the complete code for the following components, including imports, types, and error handling:

### 1. Setup Instructions
* Provide the exact `npm install` commands required for the AI SDK packages.
* Provide the environment variable requirements (`.env.local`).

### 2. Backend: Next.js API Route (`app/api/chat/route.ts`)
* Create a POST route that accepts the chat messages.
* Include a placeholder/mock function for connecting to MongoDB (`dbConnect()`) and retrieving context. 
* Write a robust System Prompt that enforces the SEBI compliance rules and injects the retrieved MongoDB context.
* Implement the `streamText` function using the `gemini-1.5-flash` model and return a `DataStreamResponse`.

### 3. Frontend: Floating Chat Widget (`components/ChatWidget.tsx`)
* Build a client-side React component (`'use client'`) using the `useChat` hook from the Vercel AI SDK.
* The UI should be a floating widget in the bottom-right corner (using Tailwind CSS `fixed bottom-6 right-6`).
* Include a toggle button with SVG icons (Open/Close states).
* The chat window should have:
    * A header indicating it is the "MIDAS Assistant".
    * A scrollable message area with auto-scrolling to the latest message.
    * Distinct message bubbles for the user (blue) and the AI (gray/white).
    * A loading/typing indicator.
    * The mandatory SEBI compliance disclaimer pinned near the input field.
    * An input form with a text field and submit button.

Please provide production-ready, clean, and well-commented TypeScript code.