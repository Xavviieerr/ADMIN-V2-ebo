"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type WizardStep = "details" | "senses" | "preview";

const VALID_STEPS: WizardStep[] = ["details", "senses", "preview"];

export function useWizardStep() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const raw = searchParams.get("step");
  const step: WizardStep =
    raw && (VALID_STEPS as string[]).includes(raw)
      ? (raw as WizardStep)
      : "details";

  const goStep = (next: WizardStep) => {
    const current = new URLSearchParams(searchParams.toString());
    current.set("step", next);
    router.replace(`${pathname}?${current.toString()}`);
  };

  return { step, goStep };
}
