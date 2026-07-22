export type PageSize = "letter" | "a4";
export type DocumentDensity = "comfortable" | "compact";
export type DocumentTypeface = "system" | "serif";

export type DocumentSettings = {
  readonly pageSize: PageSize;
  readonly density: DocumentDensity;
  readonly typeface: DocumentTypeface;
};

export const defaultDocumentSettings: DocumentSettings = {
  pageSize: "letter",
  density: "comfortable",
  typeface: "system",
};

export const pageSizeLabels: Record<PageSize, string> = {
  letter: "Letter",
  a4: "A4",
};

export const densityLabels: Record<DocumentDensity, string> = {
  comfortable: "Normal",
  compact: "Compact",
};

export const typefaceLabels: Record<DocumentTypeface, string> = {
  system: "System",
  serif: "Serif",
};
