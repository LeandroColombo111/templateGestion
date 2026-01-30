"use client";

import { useState } from "react";
import { Checkbox } from "./ui/checkbox";
import { Card } from "./ui/card";

const checklistItems = [
  "Inspect sender domain for lookalikes",
  "Hover over links before clicking",
  "Watch for urgent or threatening language",
  "Verify payment requests via a second channel",
  "Check SPF/DKIM/DMARC results",
  "Avoid opening unexpected attachments"
];

export function TrainingChecklist() {
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  return (
    <Card className="border-slate-800 bg-slate-900/60 p-6">
      <h2 className="text-lg font-semibold">Phishing readiness checklist</h2>
      <div className="mt-4 space-y-3">
        {checklistItems.map((item, index) => (
          <label key={item} className="flex items-center gap-3 text-sm text-slate-200">
            <Checkbox
              checked={checked[index] ?? false}
              onChange={(event) =>
                setChecked((prev) => ({
                  ...prev,
                  [index]: event.currentTarget.checked
                }))
              }
            />
            {item}
          </label>
        ))}
      </div>
    </Card>
  );
}
