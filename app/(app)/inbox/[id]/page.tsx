import { notFound } from "next/navigation";
import { Badge } from "../../../../components/ui/badge";
import { Card } from "../../../../components/ui/card";
import { format } from "date-fns";
import { demoEmails, getEmailById } from "../../../../lib/demo-data";
import { urgentKeywords } from "../../../../lib/scanner";
import { EmailVerdictPanel } from "../../../../components/email-verdict";

export const dynamic = "force-static";

export function generateStaticParams() {
  return demoEmails.map((email) => ({ id: email.id }));
}

function highlightText(text: string, terms: string[]) {
  if (!terms.length) return text;
  const escaped = terms
    .filter(Boolean)
    .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  if (!escaped.length) return text;
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) => {
    const isMatch = regex.test(part);
    regex.lastIndex = 0;
    return isMatch ? (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-amber-500/30 px-1 text-amber-200"
      >
        {part}
      </mark>
    ) : (
      <span key={`${part}-${index}`}>{part}</span>
    );
  });
}

export default function EmailDetailPage({
  params
}: {
  params: { id: string };
}) {
  const email = getEmailById(params.id);

  if (!email) {
    notFound();
  }

  const reasons = email.scanResult.reasons ?? [];
  const suspiciousDomains = email.links
    .filter((link) => link.isSuspicious)
    .map((link) => link.domain);
  const highlightTerms = Array.from(new Set([...urgentKeywords, ...suspiciousDomains]));

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Email detail
        </p>
        <h1 className="mt-2 text-3xl font-semibold">{email.subject}</h1>
        <p className="mt-2 text-sm text-slate-400">
          {email.fromName} - {email.fromEmail} - {format(email.date, "PPP")}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Message body</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-slate-200">
            {highlightText(email.bodyText, highlightTerms)}
          </p>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Scan verdict</h2>
          <EmailVerdictPanel
            emailId={email.id}
            baseVerdict={email.scanResult.verdict}
            riskScore={email.scanResult.riskScore}
          />
          <div className="mt-4 space-y-2">
            {reasons.length ? (
              reasons.map((reason, index) => (
                <div
                  key={`${reason.code}-${index}`}
                  className="rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200"
                >
                  <p className="font-medium">{reason.code}</p>
                  <p className="text-xs text-slate-400">{reason.message}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No reasons recorded.</p>
            )}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Links</h2>
          <div className="mt-4 space-y-3">
            {email.links.length ? (
              email.links.map((link) => (
                <div
                  key={link.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <p className="text-sm text-slate-200">
                    {highlightText(link.url, suspiciousDomains)}
                  </p>
                  <p className="text-xs text-slate-400">{link.domain}</p>
                  {link.isSuspicious ? (
                    <Badge className="mt-2 bg-amber-500/20 text-amber-200">
                      {link.reason ?? "Suspicious"}
                    </Badge>
                  ) : (
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-200">
                      Clean
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No links detected.</p>
            )}
          </div>
        </Card>
        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <h2 className="text-lg font-semibold">Attachments</h2>
          <div className="mt-4 space-y-3">
            {email.attachments.length ? (
              email.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/60 p-3"
                >
                  <p className="text-sm text-slate-200">
                    {attachment.filename}
                  </p>
                  <p className="text-xs text-slate-400">
                    {attachment.mimeType} - {attachment.sizeBytes} bytes
                  </p>
                  {attachment.isDangerous ? (
                    <Badge className="mt-2 bg-rose-500/20 text-rose-200">
                      {attachment.reason ?? "Dangerous"}
                    </Badge>
                  ) : (
                    <Badge className="mt-2 bg-emerald-500/20 text-emerald-200">
                      Clean
                    </Badge>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400">No attachments.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
