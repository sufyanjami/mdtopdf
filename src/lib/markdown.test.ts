import { describe, expect, it } from "vitest";
import {
  getDocumentStats,
  getMarkdownTitle,
  renderMarkdownToHtml,
} from "./markdown";

describe("renderMarkdownToHtml", () => {
  it("renders GitHub Flavored Markdown", async () => {
    const result = await renderMarkdownToHtml(`
# Release Plan

| Step | Status |
| --- | --- |
| Build | Done |

- [x] Typecheck
`);

    expect(result.html).toContain("<table>");
    expect(result.html).toContain('type="checkbox"');
    expect(result.html).toContain("checked");
  });

  it("renders a dash as an unordered list item", async () => {
    const result = await renderMarkdownToHtml("-\n");

    expect(result.html).toContain("<ul>");
    expect(result.html).toContain("<li></li>");
  });

  it("does not emit raw executable HTML", async () => {
    const result = await renderMarkdownToHtml(`
# Safe

<script>alert("bad")</script>
<img src="x" onerror="alert('bad')" />
`);

    const parsed = new DOMParser().parseFromString(result.html, "text/html");
    const elements = Array.from(parsed.querySelectorAll("*"));
    const hasEventHandler = elements.some((element) =>
      Array.from(element.attributes).some((attribute) =>
        attribute.name.startsWith("on"),
      ),
    );

    expect(parsed.querySelector("script")).toBeNull();
    expect(hasEventHandler).toBe(false);
  });
});

describe("getMarkdownTitle", () => {
  it("returns the first h1", () => {
    expect(getMarkdownTitle("intro\n# Quarterly Report", "fallback")).toBe(
      "Quarterly Report",
    );
  });

  it("returns the fallback when no h1 exists", () => {
    expect(getMarkdownTitle("## Section", "notes")).toBe("notes");
  });
});

describe("getDocumentStats", () => {
  it("counts words and reading time", () => {
    expect(getDocumentStats("One two three").words).toBe(3);
    expect(getDocumentStats("One two three").readingMinutes).toBe(1);
    expect(getDocumentStats("").readingMinutes).toBe(0);
  });
});
