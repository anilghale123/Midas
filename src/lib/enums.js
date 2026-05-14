// Enums shared between client and server. Keep this file dependency-free
// so client components can import without pulling mongoose into the bundle.

export const ROLES = ["SUPER_ADMIN", "EDITOR"];

export const NOTICE_CATEGORIES = [
  "General",
  "Market",
  "Regulatory",
  "IPO",
  "Dividend",
];

export const SERVICE_CATEGORIES = [
  "Trading",
  "DEMAT",
  "Advisory",
  "IPO",
  "Other",
];

export const AUDIT_ACTIONS = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGIN_FAILED",
  "SETTINGS_CHANGE",
];
