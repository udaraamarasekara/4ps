import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function FileInput({ multiple = false,onChange= ()=>{}, className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();
    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
       <> 
        <input
            {...props}
            type='file'
            multiple={multiple}
            className=
                "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm hidden"
            ref={input}
            onChange={(e)=>onChange(e)}
        />
        <div onClick={()=>input.current.click()} className='border border-gray-300 p-2  my-1 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' >
           <div className='max-h-6 overflow-hidden'>{input.current?.value ? input.current?.value : 'Select File'}</div> 
        </div>
       </>
    );
});
