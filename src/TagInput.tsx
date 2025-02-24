import "./TagInput.css";
import { useState, ChangeEvent, KeyboardEvent } from "react";

type TagInputProps = {
  initialTags?: string[];
  className?: string;
  label?: string;
  onTagsChange?: (tags: string[]) => void;
};

const TagInput = ({ initialTags = [], className, onTagsChange }: TagInputProps) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // If user presses comma
    if (e.key === ",") {
      e.preventDefault(); // Prevent the comma from being typed into the field
      const trimmedValue = inputValue.trim();

      if (trimmedValue) {
        const newTags = [...tags, trimmedValue];
        setTags(newTags);
        setInputValue("");

        onTagsChange?.(newTags);
      }
    }
  };

  return (
    <div className={className ? `${className} container` : "container"}>
      <div role="list" className="taglist">
        {tags.map((tag) => (
          <span key={tag} role="listitem" className="tag">
            <label htmlFor={`${tag}-remove`}>{tag}</label>
            <button type="button" id={`${tag}-remove`} aria-label="remove">
              X
            </button>
          </span>
        ))}
      </div>
      <input type="text" value={inputValue} onChange={handleInputChange} onKeyDown={handleKeyDown} className="input" />
    </div>
  );
};

export default TagInput;
