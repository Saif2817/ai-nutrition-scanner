import React, { useState, useEffect, useRef } from 'react';
import { ChevronDownIcon } from './Icons';
import { useLocale } from '../../context/LocaleContext';

// FIX: Update SelectProps to expect an array of objects for options, consistent with other form components.
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    id: string;
    label: string;
    options?: Array<{ value: string; label: string }>;
    children?: React.ReactNode;
    icon?: React.ReactNode;
}

export const Select: React.FC<SelectProps> = ({ id, label, options, children, icon, value, ...props }) => {
    const hasValue = value && value !== '';

    return (
        <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 peer-focus-within:text-green-600 dark:peer-focus-within:text-green-400 transition-colors duration-300 ease-in-out">
                {icon}
            </div>
            <select
                id={id}
                name={id}
                value={value}
                {...props}
                className={`
                    peer block w-full appearance-none rounded-xl border-2 bg-gray-100 dark:bg-gray-800
                    px-4 py-4 pl-12 pr-10 h-16
                    text-gray-900 dark:text-gray-100
                    transition-colors duration-300 ease-in-out
                    focus:outline-none focus:ring-4
                    border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20
                    ${!hasValue && !props.disabled ? 'text-transparent' : 'text-gray-900 dark:text-gray-100'}
                `}
            >
                <option value="" disabled hidden />
                {/* FIX: Map over the object-based options prop. */}
                {children || options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
            <label
                htmlFor={id}
                className={`
                    absolute left-12 cursor-text pointer-events-none
                    transition-all duration-300 ease-in-out
                    text-gray-500 dark:text-gray-400
                    
                    peer-focus:text-green-600 dark:peer-focus:text-green-400
                    
                    ${hasValue || props.disabled
                        ? 'top-0 -translate-y-1/2 text-xs px-1 bg-white dark:bg-gray-800' 
                        : 'top-1/2 -translate-y-1/2 text-base'
                    }
                    
                    peer-focus:top-0
                    peer-focus:-translate-y-1/2
                    peer-focus:text-xs
                    peer-focus:px-1
                    peer-focus:bg-white dark:peer-focus:bg-gray-800
                `}
            >
                {label}
            </label>
        </div>
    );
};


interface SearchableSelectProps {
    id: string;
    label: string;
    options: Array<{ value: string; label: string }>;
    value: string;
    onChange: (value: string) => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    placeholder?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    id, label, options, value, onChange, icon, disabled, placeholder
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);
    const { t } = useLocale();

    const selectedOption = options.find(opt => opt.value === value);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [wrapperRef]);

    const filteredOptions = searchTerm
        ? options.filter(option =>
            option.label.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : options;

    const handleSelect = (optionValue: string) => {
        onChange(optionValue);
        setIsOpen(false);
        setSearchTerm('');
    };

    const hasValue = value && value !== '';

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="relative">
                 <button
                    type="button"
                    id={id}
                    disabled={disabled}
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        peer relative block w-full appearance-none rounded-xl border-2 bg-gray-100 dark:bg-gray-800
                        px-4 py-4 pl-12 pr-10 h-16 text-left
                        transition-colors duration-300 ease-in-out
                        focus:outline-none focus:ring-4
                        border-gray-200 dark:border-gray-700 focus:border-green-500 dark:focus:border-green-400 focus:ring-green-500/20 dark:focus:ring-green-400/20
                        disabled:bg-gray-200 dark:disabled:bg-gray-700/50 disabled:cursor-not-allowed
                    `}
                >
                    <span className={hasValue ? 'truncate text-gray-900 dark:text-gray-100' : 'text-transparent'}>
                        {selectedOption?.label || placeholder || 'Select...'}
                    </span>
                </button>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                    {icon}
                </div>
                <div className={`absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                    <ChevronDownIcon className="w-5 h-5" />
                </div>
                 <label
                    htmlFor={id}
                    className={`
                        absolute left-12 cursor-text pointer-events-none
                        transition-all duration-300 ease-in-out
                        text-gray-500 dark:text-gray-400
                        
                        ${hasValue || isOpen
                            ? 'top-0 -translate-y-1/2 text-xs px-1 bg-gray-100 dark:bg-gray-800' 
                            : 'top-1/2 -translate-y-1/2 text-base'
                        }
                    `}
                >
                    {label}
                </label>
            </div>

            {isOpen && !disabled && (
                <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border dark:border-gray-700 max-h-60 flex flex-col">
                    <div className="p-2 border-b dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
                        <input
                            type="text"
                            placeholder={t('common.search')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            autoFocus
                        />
                    </div>
                    <ul className="overflow-y-auto">
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map(option => (
                                <li
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                                >
                                    {option.label}
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500 dark:text-gray-400">No options found</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};


interface CheckboxGroupProps {
    label: React.ReactNode;
    options: Array<{ value: string; label: string }>;
    selected: string[];
    onChange: (selected: string[]) => void;
    icon?: React.ReactNode;
    disabledOptions?: string[];
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ label, options, selected, onChange, icon, disabledOptions = [] }) => {
    const handleToggle = (optionValue: string) => {
        const newSelected = selected.includes(optionValue)
            ? selected.filter(item => item !== optionValue)
            : [...selected, optionValue];
        onChange(newSelected);
    };

    return (
        <div className="relative">
            <fieldset className="
                block w-full rounded-xl border-2 bg-gray-100 dark:bg-gray-800
                px-4 pt-6 pb-4
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
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    {options.map(option => {
                        const isDisabled = disabledOptions.includes(option.value);
                        return (
                             <label key={option.value} className={`flex items-center space-x-2 p-1 rounded-md ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-200/50 dark:hover:bg-gray-700/50 cursor-pointer'}`}>
                                <input
                                    type="checkbox"
                                    checked={selected.includes(option.value)}
                                    onChange={() => handleToggle(option.value)}
                                    disabled={isDisabled}
                                    className="h-4 w-4 rounded border-gray-400 dark:border-gray-500 text-green-600 focus:ring-green-500 bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed"
                                />
                                <span className="text-sm text-gray-800 dark:text-gray-200">{option.label}</span>
                            </label>
                        )
                    })}
                </div>
            </fieldset>
             <div className="absolute top-5 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                {icon}
            </div>
        </div>
    );
};

interface RadioGroupProps {
    label: string;
    options: Array<{ value: string; label: string }>;
    selected: string;
    onChange: (selected: string) => void;
    icon?: React.ReactNode;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ label, options, selected, onChange, icon }) => (
    <div className="relative">
        <fieldset className="
            block w-full rounded-xl border-2 bg-gray-100 dark:bg-gray-800
            px-4 pt-6 pb-4
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
            <div className="flex flex-wrap gap-2">
                {options.map(option => (
                    <label key={option.value} className={`cursor-pointer px-3 py-1.5 border rounded-full text-sm font-medium transition-colors ${
                        selected === option.value
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                    }`}>
                        <input
                            type="radio"
                            name={label}
                            value={option.value}
                            checked={selected === option.value}
                            onChange={(e) => onChange(e.target.value)}
                            className="sr-only"
                        />
                        {option.label}
                    </label>
                ))}
            </div>
        </fieldset>
        <div className="absolute top-5 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            {icon}
        </div>
    </div>
);

interface ChipGroupProps {
    label: string;
    options: string[];
    selected: string[];
    onChange: (selected: string[]) => void;
    icon?: React.ReactNode;
}

export const ChipGroup: React.FC<ChipGroupProps> = ({ label, options, selected, onChange, icon }) => {
    const handleToggle = (option: string) => {
        const newSelected = selected.includes(option)
            ? selected.filter(item => item !== option)
            : [...selected, option];
        onChange(newSelected);
    };

    return (
        <div className="relative">
             <fieldset className="
                block w-full rounded-xl border-2 bg-gray-100 dark:bg-gray-800
                px-4 pt-6 pb-4
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
                <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                        <label key={option} className={`cursor-pointer px-3 py-1.5 border rounded-full text-sm font-medium transition-colors ${
                            selected.includes(option)
                                ? 'bg-green-600 text-white border-green-600'
                                : 'bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                        }`}>
                            <input
                                type="checkbox"
                                checked={selected.includes(option)}
                                onChange={() => handleToggle(option)}
                                className="sr-only"
                            />
                            {option}
                        </label>
                    ))}
                </div>
            </fieldset>
             <div className="absolute top-5 left-0 pl-4 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
                {icon}
            </div>
        </div>
    );
};
