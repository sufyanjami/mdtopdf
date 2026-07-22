import { type ChangeEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

type EditorPaneProps = {
  readonly onChange: (value: string) => void;
  readonly source: string;
};

export function EditorPane({ onChange, source }: EditorPaneProps) {
  function handleChange(event: ChangeEvent<HTMLTextAreaElement>) {
    onChange(event.currentTarget.value);
  }

  return (
    <Card className="min-h-[560px] overflow-hidden xl:min-h-[calc(100vh-8.25rem)]">
      <CardHeader className="border-b border-border">
        <div>
          <p className="font-mono text-[0.7rem] font-medium uppercase text-muted-foreground">
            Markdown
          </p>
          <CardTitle id="editor-title" className="mt-1">
            Editor
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="h-[calc(100%-4.5rem)] p-0">
        <Textarea
          aria-label="Markdown editor"
          className="h-full min-h-[490px] rounded-none border-0 bg-transparent p-4 font-mono text-sm leading-6 shadow-none focus-visible:ring-0 xl:min-h-[calc(100vh-12.75rem)]"
          onChange={handleChange}
          placeholder="# Paste or type Markdown"
          spellCheck={false}
          value={source}
        />
      </CardContent>
    </Card>
  );
}
