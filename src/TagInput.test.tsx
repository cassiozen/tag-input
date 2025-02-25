import { describe, it, expect, vi } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TagInput from "./TagInput";

describe("TagInput", () => {
  it("renders with initial tags", () => {
    render(<TagInput initialTags={["Tag 1", "Tag 2"]} />);
    expect(screen.getByText("Tag 1")).toBeInTheDocument();
    expect(screen.getByText("Tag 2")).toBeInTheDocument();
  });

  it("calls onTagsChange when a new tag is added (Enter key)", async () => {
    const handleTagsChange = vi.fn();
    render(<TagInput onTagsChange={handleTagsChange} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "newTag{enter}");

    // onTagsChange should be called with the new list of tags
    expect(handleTagsChange).toHaveBeenCalledTimes(1);
    expect(handleTagsChange).toHaveBeenCalledWith(["newTag"]);

    // The new tag should appear in the document
    expect(screen.getByText("newTag")).toBeInTheDocument();
  });

  it("calls onTagsChange when a new tag is added (comma key)", async () => {
    const handleTagsChange = vi.fn();
    render(<TagInput onTagsChange={handleTagsChange} />);

    const input = screen.getByRole("textbox");
    await userEvent.type(input, "anotherTag,");

    // onTagsChange should be called with the new list of tags
    expect(handleTagsChange).toHaveBeenCalledTimes(1);
    expect(handleTagsChange).toHaveBeenCalledWith(["anotherTag"]);

    // The new tag should appear in the document
    expect(screen.getByText("anotherTag")).toBeInTheDocument();
  });

  it("does not add a tag if empty or duplicate", async () => {
    const handleTagsChange = vi.fn();
    render(<TagInput onTagsChange={handleTagsChange} initialTags={["tag1"]} />);

    const input = screen.getByRole("textbox");

    // Attempt to add an empty tag
    await userEvent.type(input, "{enter}");
    expect(handleTagsChange).not.toHaveBeenCalled();

    // Attempt to add duplicate tag
    await userEvent.type(input, "tag1{enter}");
    // Should still not be called because it's a duplicate
    expect(handleTagsChange).not.toHaveBeenCalled();
  });

  it("removes a tag when clicking the remove button", async () => {
    const handleTagsChange = vi.fn();
    render(<TagInput initialTags={["tag1", "tag2"]} onTagsChange={handleTagsChange} />);

    // There should be two tags
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();

    // Click the remove button for the first tag
    const removeButtons = screen.getAllByRole("button", { name: /Remove/ });
    await userEvent.click(removeButtons[0]);

    // onTagsChange should have been called with one tag
    expect(handleTagsChange).toHaveBeenCalledTimes(1);
    expect(handleTagsChange).toHaveBeenCalledWith(["tag2"]);

    // The removed tag should not exist anymore
    expect(screen.queryByText("tag1")).not.toBeInTheDocument();
  });

  it("removes the last tag on backspace when input is empty", async () => {
    const handleTagsChange = vi.fn();
    render(<TagInput initialTags={["tag1", "tag2"]} onTagsChange={handleTagsChange} />);

    const input = screen.getByRole("textbox");

    // Press Backspace on empty input
    await userEvent.click(input);
    await userEvent.keyboard("{Backspace}");

    // Should remove "tag2"
    expect(handleTagsChange).toHaveBeenCalledWith(["tag1"]);
    expect(screen.queryByText("tag2")).not.toBeInTheDocument();
  });

  it("focuses the last tag's remove button when ArrowLeft is pressed on empty input", async () => {
    render(<TagInput initialTags={["tag1", "tag2"]} />);

    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowLeft}");

    // The currently focused element should be the remove button of the last tag
    const removeButtons = screen.getAllByRole("button", { name: /Remove/ });
    expect(document.activeElement).toBe(removeButtons[1]);
  });

  it("navigates between tag remove buttons using ArrowLeft and ArrowRight", async () => {
    render(<TagInput initialTags={["tag1", "tag2", "tag3"]} />);

    const input = screen.getByRole("textbox");
    await userEvent.click(input);
    await userEvent.keyboard("{ArrowLeft}");

    // Last tag's remove button should have focus
    const removeButtons = screen.getAllByRole("button", { name: /Remove/ });
    expect(document.activeElement).toBe(removeButtons[2]);

    // Press ArrowLeft again -> moves focus to the second tag's remove button
    await userEvent.keyboard("{ArrowLeft}");
    expect(document.activeElement).toBe(removeButtons[1]);

    // Press ArrowRight -> moves focus back to the third tag's remove button
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(removeButtons[2]);

    // Press ArrowRight again -> moves focus to the input
    await userEvent.keyboard("{ArrowRight}");
    expect(document.activeElement).toBe(input);
  });
});
