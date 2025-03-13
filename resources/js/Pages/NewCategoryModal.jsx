import Modal from '@/Components/Modal';
import {XMarkIcon} from '@heroicons/react/24/solid';
import PrimaryButton from '@/Components/PrimaryButton';
import InputLabel from '@/Components/InputLabel';
import InputError from '@/Components/InputError';
import { useState } from 'react';
import axios from 'axios';
import TextInput from '@/Components/TextInput';
import { useEffect } from 'react';
export default function NewCategoryModal({show,setShow}){
    const [name,setName] = useState('')
    const [error,setError] = useState()
    const [processing,setProcessing] = useState()
    const [suggessioins,setSuggessions] = useState();
    const categoryNameChanged =async (val) =>{
        setName(val)
        const response = await axios.get(route('category.check',val ? val: '-0'))
        setSuggessions(response.data)
      
      }  
    const newCategory = (e) =>{
      e.preventDefault()
      axios.post('/category',{name:name}).then((res)=>{
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
          <InputLabel htmlFor="Name" value="Name" />

           <TextInput
                id="name"
                onChange={(e) => categoryNameChanged(e.target.value)}
                type="text"
                value={name}
                className="mt-1 block w-full"
                autoComplete="name"
            />
            {error !=='' && <InputError message={error} className="mt-2" />}
        <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
           <PrimaryButton disabled={processing}>Add</PrimaryButton>
        </div> 
        </form>
      </Modal>  
    );
}