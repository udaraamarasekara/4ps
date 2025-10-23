import { forwardRef, useEffect, useRef, useState } from "react";

export default forwardRef(function AutoCompleteTextInput(
  {
    type = "text",
    className = "",
    isFocused = false,
    suggestions = [],
    value = "",
    onChange = () => {},
    setClickedElement = () => {},
    ...props
  },
  ref
) {
  const input = ref ? ref : useRef();
  const [suggestionIndex, setSuggestionIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (isFocused) input.current?.focus();
  }, [isFocused]);

  const handleInputChange = (e) => {
    onChange(e); // Let parent update the value
    setShowSuggestions(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && suggestionIndex >= 0) {
      const selected = suggestions[suggestionIndex];
      setClickedElement(selected);
      setShowSuggestions(false);
    } else if (e.key === "ArrowDown") {
      setSuggestionIndex((prev) =>
        Math.min(prev + 1, suggestions.length - 1)
      );
    } else if (e.key === "ArrowUp") {
      setSuggestionIndex((prev) => Math.max(prev - 1, -1));
    }
  };

  const handleSuggestionClick = (index) => {
    const selected = suggestions[index];
    setClickedElement(selected);
    setShowSuggestions(false);
  };

  return (
    <div className="relative z-0">
      <input
        {...props}
        type={type}
        ref={input}
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        className={
          "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 " +
          "focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 " +
          "dark:focus:ring-indigo-600 rounded-md shadow-sm " +
          className
        }
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md shadow-md w-full max-h-40 overflow-auto">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`px-4 py-2 hover:bg-blue-50 cursor-pointer ${
                index === suggestionIndex
                  ? "bg-gray-200 dark:bg-gray-700"
                  : ""
              }`}
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
