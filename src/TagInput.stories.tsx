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
    <div>
      <TagInput onTagsChange={action("TagsChange")} className="input-medium" />
    </div>
  );
};

// With some initial tags
export const WithInitialTags = () => {
  return (
    <TagInput
      initialTags={["JavaScript", "TypeScript"]}
      onTagsChange={action("TagsChange")}
      placeholder="Add tags..."
      className="input-medium"
    />
  );
};
