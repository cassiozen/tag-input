import { action, type StoryDefault } from "@ladle/react";
import TagInput from ".";
import "../main.css";

export default {
  title: "TagInput",
} satisfies StoryDefault;

// Basic usage
export const Basic = () => {
  return (
    <>
      <TagInput
        onTagsChange={action("TagsChange")}
        placeholder="Add tags..."
        className="input-medium custom-tag"
        autoFocus
      />
      <em>Use comma or enter to add new tag</em>
    </>
  );
};

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

export const InitialTags = () => {
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

export const WithForm = () => {
  return (
    <>
      <form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          action("Submit")(formData);
        }}
      >
        <label htmlFor="tags">Tags:</label>
        <TagInput name="tags" id="tags" className="input-medium" placeholder="Add tags..." required />
        <br />

        <label htmlFor="domains">E-mail domains:</label>
        <TagInput
          name="domains"
          id="domains"
          className="input-medium"
          pattern="@[a-z0-9.\-]+\.[a-z]{2,}$"
          title="E-mail domain, like “@example.com”"
        />
        <br />

        <button type="submit">Submit</button>
      </form>
    </>
  );
};
