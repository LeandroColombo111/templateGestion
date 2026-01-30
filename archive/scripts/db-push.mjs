import { spawnSync } from "node:child_process";

const env = {
  ...process.env,
  DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db"
};

const result = spawnSync("npx", ["prisma", "db", "push"], {
  stdio: "inherit",
  env
});

process.exit(result.status ?? 0);
