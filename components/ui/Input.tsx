
import React from 'react';

interface InputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // FIX: Add onKeyDown to allow keyboard event handling.
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
  error?: string;
  success?: string;
  min?: string;
  max?: string;
  disabled?: boolean;
}

const Input: React.FC<InputProps> = ({ id, label, type, value, onChange, onKeyDown, icon, error, success, min, max, disabled }) => {
  return (
    <div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 peer-focus:text-green-600 dark:peer-focus:text-green-400 transition-colors duration-300 ease-in-out">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          onKeyDown={onKeyDown}
          min={min}
          max={max}
          disabled={disabled}
          placeholder=" " // This space is crucial for the :placeholder-shown selector to work
          className={`
            peer block w-full rounded-xl border-2 bg-gray-100 dark:bg-gray-800
            px-4 py-4 pl-12 h-16
            text-gray-900 dark:text-gray-100
            transition-colors duration-300 ease-in-out
            focus:outline-none focus:ring-4
            disabled:bg-gray-200 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed
            ${error
              ? 'border-red-500/50 dark:border-red-400/50 focus:border-red-500 focus:ring-red-500/20'
              : 'border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20'
            }
          `}
        />
        <label
          htmlFor={id}
          className={`
            absolute left-12 cursor-text
            transition-all duration-300 ease-in-out
            
            top-0 -translate-y-1/2 text-xs px-1
            bg-white dark:bg-gray-800
            
            peer-placeholder-shown:top-1/2
            peer-placeholder-shown:text-base
            peer-placeholder-shown:px-0
            peer-placeholder-shown:bg-transparent

            peer-focus:top-0
            peer-focus:text-xs
            peer-focus:px-1
            peer-focus:bg-white dark:peer-focus:bg-gray-800
            
            ${error
              ? 'text-red-600 dark:text-red-400'
              : 'text-gray-500 dark:text-gray-400 peer-focus:text-green-600 dark:peer-focus:text-green-400'
            }
          `}
        >
          {label}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600 dark:text-red-400 pl-4">{error}</p>}
      {success && !error && <p className="mt-1 text-xs text-green-600 dark:text-green-400 pl-4">{success}</p>}
    </div>
  );
};

export default Input;
