export const env = {
  demoMode: process.env.DEMO_MODE !== "false",
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",
  nextAuthUrl: process.env.NEXTAUTH_URL || "http://localhost:3000",
  nextAuthSecret:
    process.env.NEXTAUTH_SECRET || "dev-secret-change-me",
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID || "",
    clientSecret: process.env.GMAIL_CLIENT_SECRET || "",
    refreshToken: process.env.GMAIL_REFRESH_TOKEN || "",
    sender: process.env.GMAIL_SENDER || ""
  }
};

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = env.databaseUrl;
}
if (!process.env.NEXTAUTH_URL) {
  process.env.NEXTAUTH_URL = env.nextAuthUrl;
}
if (!process.env.NEXTAUTH_SECRET) {
  process.env.NEXTAUTH_SECRET = env.nextAuthSecret;
}
