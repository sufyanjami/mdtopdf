import { FileUp } from "lucide-react";
import { useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  readonly error: string | null;
  readonly fileName: string | null;
  readonly onBrowse: () => void;
  readonly onFileSelected: (file: File) => void;
};

export function FileDropzone({
  error,
  fileName,
  onBrowse,
  onFileSelected,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  function handleDragOver(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
    setIsDragging(true);
  }

  function handleDragLeave() {
    setIsDragging(false);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files.item(0);

    if (file) {
      onFileSelected(file);
    }
  }

  return (
    <Card
      className={cn(
        "border-dashed bg-card/70 transition-colors",
        isDragging && "border-ring bg-accent/40",
      )}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 items-center justify-center rounded-md border border-border bg-muted text-foreground"
            aria-hidden="true"
          >
            <FileUp size={18} strokeWidth={1.8} />
          </span>
          <div className="min-w-0">
            <CardTitle>Source File</CardTitle>
            <p className="mt-1 truncate font-mono text-xs text-muted-foreground">
              {fileName ?? "No file selected"}
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3">
        <Button onClick={onBrowse} type="button" variant="secondary">
          <FileUp size={16} />
          Browse
        </Button>
        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
