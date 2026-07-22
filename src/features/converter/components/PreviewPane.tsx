import { AlertTriangle, FileText, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { DocumentSettings } from "../../../lib/documentSettings";
import type { RenderedMarkdownState } from "../useRenderedMarkdown";

type PreviewPaneProps = {
  readonly rendered: RenderedMarkdownState;
  readonly settings: DocumentSettings;
};

export function PreviewPane({ rendered, settings }: PreviewPaneProps) {
  const isEmpty =
    rendered.status === "ready" && rendered.html.trim().length === 0;
  const previewClassName = cn(
    "document-preview",
    `preview-page-${settings.pageSize}`,
    `preview-density-${settings.density}`,
    `preview-typeface-${settings.typeface}`,
  );

  return (
    <Card className="min-h-[560px] overflow-hidden xl:min-h-[calc(100vh-8.25rem)]">
      <CardHeader className="flex-row items-center justify-between gap-3 border-b border-border">
        <div>
          <p className="font-mono text-[0.7rem] font-medium uppercase text-muted-foreground">
            PDF
          </p>
          <CardTitle id="preview-title" className="mt-1">
            Preview
          </CardTitle>
        </div>
        <RenderBadge rendered={rendered} />
      </CardHeader>

      <CardContent className="relative h-[calc(100%-4.5rem)] overflow-auto bg-muted/40 p-4">
        {rendered.status === "error" ? (
          <div
            className="absolute z-10 inline-flex items-center gap-2 rounded-md border border-destructive/30 bg-background px-3 py-2 text-sm text-destructive shadow-xs"
            role="alert"
          >
            <AlertTriangle size={18} />
            {rendered.message}
          </div>
        ) : null}
        {rendered.status === "loading" ? (
          <div className="absolute z-10 inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm text-muted-foreground shadow-xs">
            <Loader2 className="spin" size={18} />
            Rendering
          </div>
        ) : null}
        {isEmpty ? (
          <div className="grid min-h-[490px] place-items-center rounded-md border border-dashed border-border bg-background/50 xl:min-h-[calc(100vh-12.75rem)]">
            <div className="grid justify-items-center gap-3 text-center">
              <span className="flex size-10 items-center justify-center rounded-md border border-border bg-muted text-muted-foreground">
                <FileText size={18} />
              </span>
              <p className="font-mono text-sm text-muted-foreground">
                No document loaded
              </p>
            </div>
          </div>
        ) : (
          <article
            className={previewClassName}
            dangerouslySetInnerHTML={{ __html: rendered.html }}
          />
        )}
      </CardContent>
    </Card>
  );
}

type RenderBadgeProps = {
  readonly rendered: RenderedMarkdownState;
};

function RenderBadge({ rendered }: RenderBadgeProps) {
  if (rendered.status === "error") {
    return <Badge variant="destructive">Error</Badge>;
  }

  if (rendered.status === "loading") {
    return <Badge variant="outline">Rendering</Badge>;
  }

  if (rendered.warnings.length > 0) {
    return <Badge variant="warning">Warnings</Badge>;
  }

  if (rendered.html.trim().length === 0) {
    return <Badge variant="secondary">Idle</Badge>;
  }

  return <Badge variant="outline">Ready</Badge>;
}
