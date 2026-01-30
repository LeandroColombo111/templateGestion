import { env } from "../lib/env";

export async function fetchEmailsFromGmail() {
  if (!env.gmail.clientId || !env.gmail.clientSecret || !env.gmail.refreshToken) {
    throw new Error("Gmail provider is not configured.");
  }

  // Placeholder for optional integration. Kept disabled by default.
  return [];
}
