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

  describe("Form & Validation", () => {
    it("submits the tags when used within a form and given a name", async () => {
      const handleSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        // For clarity, convert the formData entries into a plain object
        const entries: Record<string, string> = {};
        formData.forEach((value, key) => {
          entries[key] = String(value);
        });
        expect(entries).toEqual({
          // The name we passed to <TagInput>...
          "my-tags": "react,typescript",
        });
      });

      render(
        <form onSubmit={handleSubmit}>
          <TagInput name="my-tags" />
          <button type="submit">Submit</button>
        </form>
      );

      // Add two tags
      const input = screen.getByRole("textbox");
      await userEvent.type(input, "react{enter}");
      await userEvent.type(input, "typescript{enter}");

      // Submit the form
      await userEvent.click(screen.getByText("Submit"));

      expect(handleSubmit).toHaveBeenCalledTimes(1);
    });

    it("prevents form submission if 'required' is set but no tags exist", async () => {
      const handleSubmit = vi.fn((e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // We don't expect this to run if the TagInput prevents submission
      });

      render(
        <form onSubmit={handleSubmit}>
          <TagInput name="my-tags" required />
          <button type="submit">Submit</button>
        </form>
      );

      // Attempt to submit with no tags
      await userEvent.click(screen.getByText("Submit"));

      // The form should not be considered valid—so submission shouldn't happen
      expect(handleSubmit).not.toHaveBeenCalled();
    });

    it("does not add a tag that fails the pattern", async () => {
      // Let's assume the pattern only allows alphanumeric characters
      render(<TagInput pattern="^[a-zA-Z0-9]+$" />);
      const input = screen.getByRole("textbox", { hidden: false });

      // Try adding invalid tag with special character
      await userEvent.type(input, "invalid!!!{enter}");

      // Tag should NOT be added
      expect(screen.queryByText("invalid!!!")).not.toBeInTheDocument();
    });

    it("adds a tag if it matches the provided pattern", async () => {
      render(<TagInput pattern="^[a-zA-Z0-9]+$" />);
      const input = screen.getByRole("textbox", { hidden: false });

      // Try adding a valid alphanumeric tag
      await userEvent.type(input, "Tag123{enter}");

      // Tag should be added
      expect(screen.getByText("Tag123")).toBeInTheDocument();
    });

    it("shows error styling when validity fails", async () => {
      // The container should have the 'has-error' class if validation fails
      render(<TagInput pattern="^[a-zA-Z]+$" />);
      const container = screen.getByRole("list");
      const input = screen.getByRole("textbox", { hidden: false });

      // Add invalid tag
      await userEvent.type(input, "abc123{enter}");
      // The container should get an error class
      expect(container).toHaveClass("has-error");
    });
  });
});
