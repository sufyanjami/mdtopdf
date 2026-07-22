import { useEffect, useState } from "react";
import {
  renderMarkdownToHtml,
  type MarkdownRenderResult,
} from "../../lib/markdown";

export type RenderedMarkdownState =
  | {
      readonly status: "loading";
      readonly html: string;
      readonly warnings: readonly string[];
    }
  | {
      readonly status: "ready";
      readonly html: string;
      readonly warnings: readonly string[];
    }
  | {
      readonly status: "error";
      readonly html: string;
      readonly message: string;
      readonly warnings: readonly string[];
    };

const loadingState: RenderedMarkdownState = {
  status: "loading",
  html: "",
  warnings: [],
};

export function useRenderedMarkdown(source: string): RenderedMarkdownState {
  const [state, setState] = useState<RenderedMarkdownState>(loadingState);

  useEffect(() => {
    let isCurrent = true;

    setState((current) => ({
      status: "loading",
      html: current.html,
      warnings: current.warnings,
    }));

    void renderMarkdownToHtml(source)
      .then((result: MarkdownRenderResult) => {
        if (!isCurrent) {
          return;
        }

        setState({
          status: "ready",
          html: result.html,
          warnings: result.warnings,
        });
      })
      .catch((error: unknown) => {
        if (!isCurrent) {
          return;
        }

        setState({
          status: "error",
          html: "",
          message:
            error instanceof Error
              ? error.message
              : "Markdown rendering failed.",
          warnings: [],
        });
      });

    return () => {
      isCurrent = false;
    };
  }, [source]);

  return state;
}
