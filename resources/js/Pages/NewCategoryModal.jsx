import Modal from '@/Components/Modal';
import {XMarkIcon} from '@heroicons/react/24/solid';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState,useCallback,useRef } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
import { debounce } from 'lodash';

import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function NewCategoryModal({show,setShow}){
    const prevCatSugst =  useRef()
    const parentRef =  useRef()
    const [name,setName] = useState('')
    const [parent,setParent] = useState('')
    const [error,setError] = useState()
    const [processing,setProcessing] = useState()
    const [suggessioins,setSuggessions] = useState();
    const [parentSugges,setParentSugges] = useState();
    const categoryNameChanged =
       useCallback(
      debounce(async (val) =>{
        const response = await axios.get(route('category.check',val ? val: '-0'))
        setSuggessions(response.data)
      
      },300),[])
      const updateParentSuggessions =useCallback(
        debounce(async (input) =>{
    const response = await axios.get(route('category.fetch',input ? input: '-0'))
    setParentSugges(response.data[1])
   
  
},300),[])
      
    const newCategory = (e) =>{
      e.preventDefault()
      axios.post('/category',{name:name,parent_name:parent}).then((res)=>{
        setShow(false)
      }).catch()
    }

    useEffect(()=>{
      suggessioins ? setError('Category name already exists') :setError('')    },[suggessioins])
    return(
      <Modal show={show} maxWidth='xl' >
        <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
            <h3 className="text-3xl font-semibold">
              New Category
            </h3>
            <button
                className="p-0 ml-auto bg-transparent border-0 text-red-500 float-right leading-none  outline-none focus:outline-none"
                onClick={() => setShow(false)}
            >
                <XMarkIcon className=' mt-1 bold p-0 w-6 h-auto  text-3xl font-extrabold hover:cursor-pointer' />
            </button>
        </div>          
          <form onSubmit={(e)=>newCategory(e)} className='m-6'>
          <div className='flex flex-col md:flex-row md:space-x-4'>
            <div className='w-full md:w-1/2' >
                 
              <InputLabel htmlFor="Name" value="Name" />

              <TextInput
                    id="name"
                    onChange={(e) => {setName(e.target.value),categoryNameChanged(e.target.value)}}
                    type="text"
                    value={name}
                    className="mt-1 block w-full"
                    autoComplete="name"
                />
             </div>
             <div className='w-full md:w-1/2' >
                 
                 <InputLabel htmlFor="parent" value="Parent(optional)" />
   
                 <AutoCompleteTextInput
                     id="parent"
                     ref={parentRef}
                     value={parent}
                     suggestions={parentSugges}
                     onChange={(e) => updateParentSuggessions(e.target.value)}
                     setClickedElement={(el)=>{setParent(el),prevCatSugst.current=el}}
                     className="mt-1 block w-full"
                   />
                </div>
          </div>      
            {error !=='' && <InputError message={error} className="mt-2" />}
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
           <PrimaryButton disabled={processing}>Add</PrimaryButton>
        </div> 
        </form>
      </Modal>  
    );
}