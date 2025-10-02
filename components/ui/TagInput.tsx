import React, { useState, useEffect, useRef } from 'react';
import { XIcon } from './Icons';

interface TagInputProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  placeholder: string;
  label: string;
  icon?: React.ReactNode;
  inputValue: string;
  onInputChange: (value: string) => void;
  suggestions?: string[];
}

export const TagInput: React.FC<TagInputProps> = ({ tags, setTags, placeholder, label, icon, inputValue, onInputChange, suggestions }) => {
  const [hint, setHint] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (inputValue.length >= 3 && suggestions) {
      const newFiltered = suggestions.filter(s => 
        s.toLowerCase().includes(inputValue.toLowerCase()) && 
        !tags.find(tag => tag.toLowerCase() === s.toLowerCase())
      );
      setFilteredSuggestions(newFiltered.slice(0, 5)); // Limit to 5 suggestions
      setShowSuggestions(newFiltered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  }, [inputValue, suggestions, tags]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onInputChange(value);
    if (value.length > 40) {
      setHint('Suggestion: Long entries can be hard to read.');
    } else {
      setHint('');
    }
  };

  const addTag = (newTag: string) => {
    const trimmedTag = newTag.trim();
    if (trimmedTag && !tags.find(tag => tag.toLowerCase() === trimmedTag.toLowerCase())) {
        setTags([...tags, trimmedTag]);
    }
    onInputChange('');
    setShowSuggestions(false);
    setHint('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      e.preventDefault();
      addTag(inputValue);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <fieldset className="
        block w-full rounded-xl border-2 bg-gray-100 dark:bg-gray-800
        px-4 pt-6 pb-3
        border-gray-200 dark:border-gray-700
        transition-colors duration-300 ease-in-out
      ">
        <legend className="
            text-xs px-1 ml-8
            text-gray-500 dark:text-gray-400
            bg-white dark:bg-gray-800
        ">
            {label}
        </legend>

        <div className="flex flex-wrap items-center gap-2">
            {tags.map((tag, index) => (
            <span key={index} className="flex items-center bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-100 text-sm font-medium px-3 py-1 rounded-full">
                {tag}
                <button
                onClick={() => removeTag(tag)}
                className="ml-2 text-green-700 dark:text-green-200 hover:text-green-900 dark:hover:text-green-400"
                aria-label={`Remove ${tag}`}
                >
                <XIcon className="w-4 h-4" />
                </button>
            </span>
            ))}
            <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="flex-grow bg-transparent focus:outline-none text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 min-w-[150px]"
            />
        </div>
      </fieldset>
      
      <div className="absolute top-5 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
          {icon}
      </div>

      {showSuggestions && (
        <ul className="absolute z-30 w-full bg-gray-600 border border-gray-500 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
            {filteredSuggestions.map(suggestion => (
                <li 
                    key={suggestion} 
                    onClick={() => addTag(suggestion)}
                    className="px-4 py-3 cursor-pointer hover:bg-gray-500 text-sm text-white"
                >
                    {suggestion}
                </li>
            ))}
        </ul>
      )}

      {hint && <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400 pl-4">{hint}</p>}
    </div>
  );
};