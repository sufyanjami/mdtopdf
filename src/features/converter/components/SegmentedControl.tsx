import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type SegmentedOption<TValue extends string> = {
  readonly label: string;
  readonly value: TValue;
};

type SegmentedControlProps<TValue extends string> = {
  readonly label: string;
  readonly onChange: (value: TValue) => void;
  readonly options: readonly SegmentedOption<TValue>[];
  readonly value: TValue;
};

export function SegmentedControl<TValue extends string>({
  label,
  onChange,
  options,
  value,
}: SegmentedControlProps<TValue>) {
  return (
    <fieldset className="grid gap-2">
      <legend className="font-mono text-[0.7rem] font-medium uppercase text-muted-foreground">
        {label}
      </legend>
      <div className="grid grid-flow-col rounded-md border border-border bg-muted p-1">
        {options.map((option) => (
          <Button
            aria-pressed={option.value === value}
            className={cn(
              "h-8 rounded-sm px-2 font-mono text-xs",
              option.value === value
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground",
            )}
            key={option.value}
            onClick={() => onChange(option.value)}
            type="button"
            variant="ghost"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </fieldset>
  );
}
