import React, { useState, KeyboardEvent, ChangeEvent, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface TagSelectorProps {
  availableTags: string[];          // List of all possible tags
  selectedTags?: string[];          // Controlled selected tags (optional)
  onChange?: (tags: string[]) => void; // Callback when selection changes
  placeholder?: string;
  className?: string;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  availableTags,
  selectedTags: controlledSelectedTags,
  onChange,
  placeholder = 'Add tags...',
  className,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [internalSelectedTags, setInternalSelectedTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = controlledSelectedTags ?? internalSelectedTags;

  // Add tag if it exists in availableTags and not already selected
  const addTag = (tag: string) => {
    if (!tag.trim()) return;
    const normalizedTag = tag.trim();
    if (
      availableTags.includes(normalizedTag) &&
      !selected.includes(normalizedTag)
    ) {
      const newTags = [...selected, normalizedTag];
      if (onChange) onChange(newTags);
      else setInternalSelectedTags(newTags);
    }
    setInputValue('');
  };

  // Remove tag by index
  const removeTag = (tag: string) => {
    const newTags = selected.filter((t) => t !== tag);
    if (onChange) onChange(newTags);
    else setInternalSelectedTags(newTags);
  };

  // Handle input key presses for adding tags on Enter or comma
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === 'Backspace' && !inputValue) {
      // Remove last tag if input empty and backspace pressed
      removeTag(selected[selected.length - 1]);
    }
  };

  // Filter suggestions that match input and are not selected
  const filteredSuggestions = availableTags.filter(
    (tag) =>
      tag.toLowerCase().includes(inputValue.toLowerCase()) &&
      !selected.includes(tag)
  );

  // Click handler to add tag from suggestions
  const handleSuggestionClick = (tag: string) => {
    addTag(tag);
    inputRef.current?.focus();
  };

  return (
    <div className={cn('w-full max-w-md', className)}>      <div className="flex flex-wrap gap-2 border rounded-md p-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700">        {selected.map((tag) => (
          <div
            key={tag}
            className="flex items-center bg-blue-600 text-white px-3 py-1 rounded-full text-sm select-none animate-fade-in"
            style={{ animation: `card-entrance 0.3s ease-out forwards` }}
          >
            <span>{tag}</span>
            <button
              onClick={() => removeTag(tag)}
              aria-label={`Remove tag ${tag}`}
              className="ml-2 focus:outline-none focus:ring-2 focus:ring-white rounded-full transition-transform hover:scale-125"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          placeholder={placeholder}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow min-w-[120px] bg-transparent border-none focus:ring-0 focus:outline-none text-gray-900 dark:text-gray-100 transition-all duration-300 focus:bg-blue-50 dark:focus:bg-blue-900/30 focus:px-2 rounded placeholder-gray-500 dark:placeholder-gray-400"
          aria-label="Tag input"
          autoComplete="off"
        />
      </div>      {inputValue && filteredSuggestions.length > 0 && (
        <ul className="mt-1 max-h-40 overflow-auto rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-10 relative animate-fade-in">
          {filteredSuggestions.map((tag, index) => (
            <li
              key={tag}
              onClick={() => handleSuggestionClick(tag)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-600 hover:text-white dark:text-gray-200 dark:hover:text-white transition-colors duration-150"
              role="option"
              tabIndex={0}
              style={{ 
                animation: `card-entrance 0.3s ease-out forwards`,
                animationDelay: `${index * 0.05}s` 
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleSuggestionClick(tag);
                }
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagSelector;
