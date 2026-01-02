import { forwardRef, useEffect, useRef, useState } from "react";

export default forwardRef(function FileInput(
  { multiple = false, onChange = () => {}, className = "", isFocused = false,url=null, ...props },
  ref
) {
  const input = ref ? ref : useRef();
  const [previews, setPreviews] = useState(url ? [url] : []);

  useEffect(() => {
    if (isFocused) {
      input.current.focus();
    }
  }, [isFocused]);

  const handleChange = (e) => {
    const files = Array.from(e.target.files);
    setPreviews(files.map((file) => URL.createObjectURL(file))); // generate preview URLs
    onChange(e); // still call parent onChange
  };

  return (
    <>
      <input
        {...props}
        type="file"
        multiple={multiple}
        className="border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm hidden"
        ref={input}
        onChange={handleChange}
        accept="image/*" // optional: restrict to images
      />
      <div
        onClick={() => input.current.click()}
        className="border border-gray-300 p-2 my-1 cursor-pointer focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
      >
        <div className="max-h-6 overflow-hidden">
          {input.current?.value ? input.current?.value : "Select File"}
        </div>
      </div>

      {/* Image previews */}
      {previews.length > 0 && (
        <div className="flex gap-2 flex-wrap mt-2">
          {previews.map((src, i) => (
            <img
              key={i}
              src={'/' + src}
              alt={`preview-${i}`}
              className="w-20 h-20 object-cover rounded-md border"
            />
          ))}
        </div>
      )}
    </>
  );
});
