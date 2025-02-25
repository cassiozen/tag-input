import { action } from "@ladle/react";
import TagInput from "./TagInput";
import "./main.css";

const meta = {
  title: "TagInput",
};

export default meta;

// Basic usage
export const Basic = () => {
  return (
    <>
      <TagInput onTagsChange={action("TagsChange")} placeholder="Add tags..." className="input-medium" autoFocus />
      <em>Use comma or enter to add new tag</em>
    </>
  );
};

// Disabled
export const Disabled = () => {
  return (
    <TagInput
      initialTags={["Locked", "Can't touch this"]}
      onTagsChange={action("TagsChange")}
      className="input-medium"
      disabled
    />
  );
};

// With some initial tags
export const WithInitialTags = () => {
  return (
    <>
      <TagInput
        initialTags={["JavaScript", "TypeScript"]}
        onTagsChange={action("TagsChange")}
        placeholder="Add tags..."
        className="input-medium"
        autoFocus
      />
      <em>Use comma or enter to add new tag</em>
    </>
  );
};
