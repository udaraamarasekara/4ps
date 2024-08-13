import { forwardRef, useEffect, useRef, useState } from 'react';

export default forwardRef(function AutocompleteTextInput({
  type = 'text',
  className = '',
  isFocused = false,
  suggestions = [], // new prop for autocomplete suggestions
  onChange = () => {}, // new prop for handling selection
  ...props
}, ref) {
  const input = ref ? ref : useRef();
  const [value, setValue] = useState(''); // state for input value
  const [suggestionIndex, setSuggestionIndex] = useState(-1); // state for selected suggestion index
  const [showSuggestions, setShowSuggestions] = useState(false); // state for showing suggestions

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, []);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);
    onChange(e);
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && suggestionIndex >= 0) {
      setValue(suggestions[suggestionIndex]);
      setShowSuggestions(false);
    } else if (e.key === 'ArrowDown') {
      setSuggestionIndex(Math.min(suggestionIndex + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      setSuggestionIndex(Math.max(suggestionIndex - 1, -1));
    }
  };

  const handleSuggestionClick = (index) => {
    setValue(suggestions[index]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative z-0">
      <input
        {...props}
        type={type}
        className={
          'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
          className
        }
        ref={input}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      {showSuggestions && (
        <ul className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md w-full">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 cursor-pointer ${index === suggestionIndex ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
              onClick={() => handleSuggestionClick(index)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});