import { TrainingChecklist } from "../../../components/training-checklist";
import { Card } from "../../../components/ui/card";

const examples = [
  {
    title: "Fake bank alert",
    signal: "Lookalike domain + urgent language",
    detail:
      "Sender uses acmeb4nk.com and asks you to verify immediately."
  },
  {
    title: "Invoice scam",
    signal: "Macro-enabled attachment",
    detail:
      "Invoice_43922.docm includes macros and comes from cloudblll.io."
  },
  {
    title: "CEO fraud",
    signal: "Display name mismatch",
    detail:
      "Display name claims to be CEO but domain is glob0corp.com."
  }
];

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-slate-400">
          Training
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Interactive phishing lab</h1>
        <p className="mt-2 text-sm text-slate-400">
          Practice spotting high-risk patterns before they hit production.
        </p>
      </div>

      <TrainingChecklist />

      <div className="grid gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <Card
            key={example.title}
            className="border-slate-800 bg-slate-900/60 p-6"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-mint-400">
              Example
            </p>
            <h2 className="mt-3 text-lg font-semibold">{example.title}</h2>
            <p className="mt-2 text-sm text-slate-300">{example.signal}</p>
            <p className="mt-3 text-xs text-slate-500">{example.detail}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
