import { useState, useRef, type ChangeEvent, type KeyboardEvent, type InputHTMLAttributes } from "react";
import clsx from "clsx";
import classes from "./TagInput.module.css";

const noop = () => {};

type TagInputProps = {
  initialTags?: string[];
  className?: string;
  onTagsChange?: (tags: string[]) => void;
  name?: string;
};

const TagInput = ({
  initialTags = [],
  className,
  onTagsChange,
  name,
  required,
  disabled,
  ...props
}: TagInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, keyof TagInputProps>) => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>(initialTags);
  const [hasError, setHasError] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const tagButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);

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

  const handleContainerClick = () => {
    inputRef.current?.focus();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setHasError(!!inputRef.current?.checkValidity());
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { selectionStart, selectionEnd } = e.currentTarget;

    // Add tag on comma or Enter
    if ((e.key === "," || e.key === "Enter") && inputValue.trim()) {
      e.preventDefault();
      const isValid = inputRef.current?.checkValidity();

      if (isValid) {
        addTag(inputValue.replace(",", ""));
      } else {
        inputRef.current?.reportValidity();
      }
      setHasError(!isValid);
    }
    // Remove last tag if Backspace is pressed and input is empty
    else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
    // If ArrowLeft is pressed when the cursor is on the left, focus last tag's delete button
    else if (e.key === "ArrowLeft" && selectionStart === 0 && selectionEnd === 0 && tags.length > 0) {
      tagButtonRefs.current[tags.length - 1]?.focus();
    }
  };

  const handleDeleteButtonKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    if (e.key === "Backspace" || e.key === "Delete") {
      removeTag(index);
    } else if (e.key === "ArrowLeft") {
      // Focus the previous tag’s delete button if it exists
      if (index > 0) {
        tagButtonRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowRight") {
      // Focus the next tag’s delete button if it exists,
      // otherwise (if on the last tag) focus the input
      if (index < tags.length - 1) {
        tagButtonRefs.current[index + 1]?.focus();
      } else {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
  };

  return (
    <div
      role="list"
      className={clsx(className, classes.container, disabled && classes.disabled, hasError && "has-error")}
      onClick={handleContainerClick}
    >
      {tags.map((tag, index) => (
        <span key={`${tag}-${index}`} role="listitem" className={classes.tag} aria-label={tag}>
          {tag}
          <button
            type="button"
            ref={(el) => {
              tagButtonRefs.current[index] = el;
            }}
            onClick={() => removeTag(index)}
            onKeyDown={(e) => handleDeleteButtonKeyDown(e, index)}
            aria-label={`Remove ${tag}`}
            className={classes.tagRemove}
            disabled={disabled}
          >
            ×
          </button>
        </span>
      ))}
      {name && (
        <input
          type="text"
          aria-hidden
          className={classes.hidden}
          tabIndex={-1}
          name={name}
          value={tags.join()}
          required={required}
          onChange={noop} // React requires an onChange event handler for controlled components
          onFocus={() => inputRef.current?.focus()}
        />
      )}

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        className={classes.input}
        aria-label="Type a comma or enter to insert tag"
        data-minchars={Math.max(inputValue.length, props.placeholder?.length ?? 0) ?? 5}
        disabled={disabled}
        {...props}
      />
    </div>
  );
};

export default TagInput;
