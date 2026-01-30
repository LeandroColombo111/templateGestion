import { prisma } from "../lib/db";

export async function fetchEmails() {
  return prisma.emailMessage.findMany({
    orderBy: { date: "desc" },
    include: {
      links: true,
      attachments: true,
      scanResult: true
    }
  });
}
