import { describe, expect, it } from "vitest";
import {
  maxMarkdownFileBytes,
  readMarkdownFile,
  stripMarkdownExtension,
  validateMarkdownFile,
} from "./fileInput";

describe("validateMarkdownFile", () => {
  it("accepts Markdown file extensions", () => {
    const file = new File(["# Notes"], "notes.md", { type: "text/markdown" });

    expect(validateMarkdownFile(file)).toBeNull();
  });

  it("rejects non-Markdown files", () => {
    const file = new File(["hello"], "notes.txt", { type: "text/plain" });

    expect(validateMarkdownFile(file)).toBe("Choose a .md or .markdown file.");
  });

  it("rejects files larger than the limit", () => {
    const file = new File([""], "large.md", { type: "text/markdown" });
    Object.defineProperty(file, "size", {
      value: maxMarkdownFileBytes + 1,
    });

    expect(validateMarkdownFile(file)).toBe(
      "Choose a Markdown file smaller than 5 MB.",
    );
  });
});

describe("readMarkdownFile", () => {
  it("normalizes line endings", async () => {
    const file = new File(["# One\r\n\r\nBody\r"], "one.markdown", {
      type: "text/markdown",
    });

    await expect(readMarkdownFile(file)).resolves.toMatchObject({
      name: "one.markdown",
      source: "# One\n\nBody\n",
    });
  });
});

describe("stripMarkdownExtension", () => {
  it("removes Markdown extensions", () => {
    expect(stripMarkdownExtension("report.md")).toBe("report");
    expect(stripMarkdownExtension("report.markdown")).toBe("report");
  });
});
