import {
  defaultDocumentSettings,
  type DocumentDensity,
  type DocumentSettings,
  type DocumentTypeface,
  type PageSize,
} from "../../../lib/documentSettings";
import {
  SegmentedControl,
  type SegmentedOption,
} from "./SegmentedControl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type DocumentSettingsPanelProps = {
  readonly onChange: (settings: DocumentSettings) => void;
  readonly settings: DocumentSettings;
};

const pageSizeOptions: readonly SegmentedOption<PageSize>[] = [
  { label: "Letter", value: "letter" },
  { label: "A4", value: "a4" },
];

const typefaceOptions: readonly SegmentedOption<DocumentTypeface>[] = [
  { label: "System", value: "system" },
  { label: "Serif", value: "serif" },
];

const densityOptions: readonly SegmentedOption<DocumentDensity>[] = [
  { label: "Normal", value: "comfortable" },
  { label: "Compact", value: "compact" },
];

export function DocumentSettingsPanel({
  onChange,
  settings,
}: DocumentSettingsPanelProps) {
  return (
    <Card aria-label="Document settings">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Document</CardTitle>
        <Button
          onClick={() => onChange(defaultDocumentSettings)}
          type="button"
          variant="ghost"
          size="sm"
        >
          Reset
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4">
        <SegmentedControl
          label="Page"
          onChange={(pageSize) => onChange({ ...settings, pageSize })}
          options={pageSizeOptions}
          value={settings.pageSize}
        />
        <SegmentedControl
          label="Typeface"
          onChange={(typeface) => onChange({ ...settings, typeface })}
          options={typefaceOptions}
          value={settings.typeface}
        />
        <SegmentedControl
          label="Density"
          onChange={(density) => onChange({ ...settings, density })}
          options={densityOptions}
          value={settings.density}
        />
      </CardContent>
    </Card>
  );
}
