import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextArea({ rows = 6, cols = 20, className = '', isFocused = false, ...props }, ref) {
    const textarea = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            textarea.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            rows={rows}
            cols={cols}
            className={
                'border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                className
            }
            ref={textarea}
        />
    );
});
