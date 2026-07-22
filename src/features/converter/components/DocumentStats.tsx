import { Hash, Timer, WholeWord } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { getDocumentStats } from "../../../lib/markdown";

type DocumentStatsProps = {
  readonly source: string;
};

export function DocumentStats({ source }: DocumentStatsProps) {
  const stats = getDocumentStats(source);

  return (
    <Card
      className="grid grid-cols-3 gap-px overflow-hidden bg-border p-0"
      aria-label="Document stats"
    >
      <StatItem
        icon={<WholeWord size={16} />}
        label="Words"
        value={stats.words.toLocaleString()}
      />
      <StatItem
        icon={<Hash size={16} />}
        label="Chars"
        value={stats.characters.toLocaleString()}
      />
      <StatItem
        icon={<Timer size={16} />}
        label="Read"
        value={`${stats.readingMinutes}m`}
      />
    </Card>
  );
}

type StatItemProps = {
  readonly icon: ReactNode;
  readonly label: string;
  readonly value: string;
};

function StatItem({ icon, label, value }: StatItemProps) {
  return (
    <div className="grid gap-2 bg-card p-3">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="font-mono text-[0.68rem] uppercase text-muted-foreground">
        {label}
      </span>
      <strong className="font-mono text-sm font-semibold text-foreground">
        {value}
      </strong>
    </div>
  );
}
