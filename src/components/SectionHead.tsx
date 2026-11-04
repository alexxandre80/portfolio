import type { ReactNode } from "react";

type Props = { eyebrow: string; title: string; lead?: string; children?: ReactNode };

export function SectionHead({ eyebrow, title, lead, children }: Props) {
  return (
    <div className="head mb-10 flex flex-wrap items-end justify-between gap-6">
      <div>
        <div className="font-mono text-xs tracking-widest text-accent uppercase">{eyebrow}</div>
        <h2 className="mt-2 text-[clamp(28px,3.4vw,40px)] font-semibold tracking-[-0.03em]">{title}</h2>
        {lead && <p className="mt-3 max-w-2xl leading-relaxed text-muted">{lead}</p>}
      </div>
      {children}
    </div>
  );
}
