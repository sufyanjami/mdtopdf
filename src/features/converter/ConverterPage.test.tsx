import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ConverterPage } from "./ConverterPage";

describe("ConverterPage", () => {
  it("starts with an empty document", async () => {
    render(<ConverterPage />);

    expect(
      screen.getByRole("heading", {
        name: "Markdown to PDF in the browser",
      }),
    ).toBeVisible();
    expect(screen.getByLabelText("Markdown editor")).toHaveValue("");
    expect(await screen.findByText("No document loaded")).toBeVisible();
    expect(screen.getByRole("button", { name: "Export PDF" })).toBeDisabled();
    expect(screen.getByText("Built by Sufyan Jami")).toBeVisible();
  });

  it("updates the preview when Markdown changes", async () => {
    render(<ConverterPage />);

    fireEvent.change(screen.getByLabelText("Markdown editor"), {
      target: {
        value: "# Typed Document\n\nBody copy.",
      },
    });

    expect(
      await screen.findByRole("heading", { name: "Typed Document" }),
    ).toBeVisible();
  });
});
