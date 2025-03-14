import { forwardRef, useEffect, useRef } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import PrimaryButton from './PrimaryButton';
export default forwardRef(function DynamicPropertyPane({ type = 'text', className = '',deleteProperty = () => {},addProperty = () => {},isDisabled,properties, isFocused = false,  ...props }, ref) {
    const propertyName = ref ? ref : useRef();
    const propertyType = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            propertyName.current.focus();
        }
    }, []);

    return (
        <div className='flex md:space-x-4 md:flex-row flex-col'> 
         <div className='flex gap-3 md:flex-row  flex-col w-full md:w-1/2'>
            <input
                {...props}
                type={type}
                className={
                    'border-gray-300 w-full h-12 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                    className
                }
                ref={propertyName}
            />
                <select
                {...props}
                type={type}
                className={
                    'border-gray-300 w-full h-12 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm ' +
                    className
                }
                ref={propertyType}
              >
              <option>Text</option>
              <option>Number</option>
              <option>Boolean</option>
              </select>  
            <PrimaryButton onClick={(e)=>{e.preventDefault();propertyName.current.value && addProperty({name:propertyName.current.value,type:propertyType.current.value})}} className='w-full h-12 hover:cursor-pointer flex justify-center' disabled={isDisabled}>
                Add Item
            </PrimaryButton>
          </div>  
          <ul className="w-full mt-3 md:mt-0 md:w-1/2 text-sm font-medium text-gray-900 items-center bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
            {properties.length > 0 ? (
                properties.map((prop, index) => (
                <li
                    key={index}
                    className="w-full flex flex-row justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-600"
                >
                    <div>{prop.name}  </div>
                    <div>{prop.type}  </div>
                    <XCircleIcon onClick={(e)=>{e.preventDefault();deleteProperty(prop.name)}} className="hover:cursor-pointer text-gray-600 w-10" />
                </li>
                ))
            ) : (
                <li className="w-full flex flex-row justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                No properties!
                </li>
            )}
          </ul>

        </div>
    );
});
