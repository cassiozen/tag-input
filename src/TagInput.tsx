import classes from "./TagInput.module.css";
import { useState, useRef, ChangeEvent, KeyboardEvent } from "react";
import { type InputProps } from "./types";

type TagInputProps = {
  initialTags?: string[];
  className?: string;
  onTagsChange?: (tags: string[]) => void;
  disabled?: boolean;
} & Omit<InputProps, "disabled">;

const TagInput = ({ initialTags = [], className, onTagsChange, ...props }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);

  const addTag = (value: string) => {
    const trimmedValue = value.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      const newTags = [...tags, trimmedValue];
      setTags(newTags);
      setInputValue("");
      onTagsChange?.(newTags);
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = tags.toSpliced(indexToRemove, 1);
    setTags(newTags);
    onTagsChange?.(newTags);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Add tag on comma, Enter, or Tab (if there's text)
    if ((e.key === "," || e.key === "Enter") && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.replace(",", ""));
    }
    // Remove last tag if Backspace is pressed and input is empty
    else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div role="list" className={className ? `${className} ${classes.container}` : classes.container}>
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          role="listitem"
          className={classes.tag}
          aria-label={`${tag}, tag ${index + 1} of ${tags.length}`}
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            aria-label={`Remove ${tag}`}
            className={classes.tagRemove}
          >
            ×
          </button>
        </span>
      ))}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className={classes.input}
        aria-label="Type a comma or enter to insert tag"
        {...props}
      />
    </div>
  );
};

export default TagInput;
