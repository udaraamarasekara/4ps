
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,useForm,router } from '@inertiajs/react';
import NewProjClasFormPartOne from './NewProjClasFormPartOne';
import NewProjClasFormPartTwo from './NewProjClasFormPartTwo';
import { Transition } from '@headlessui/react';

import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState,useEffect } from 'react';
export default function NewProjectClassification({ auth }) {

 const [page,setPage]=useState(1);   

    const { data, setData, errors, setError,clearErrors,post, reset, processing, recentlySuccessful } = useForm({
        name: '',
        parent_name: '',
        description: '',
        ingredients:[{}],
        humanResources:[{}],
        properties:[{}]

    });
const movetoPartOne = () => setPage(1)
const movetoPartTwo = () => setPage(2)
const [showPopup,setShowPopup] =useState(false)
const [isSuccessPopup,setIsSuccessPopup]= useState(true)
const goBack = () => {
   page===1? router.visit(route('projectClassification.index')):page===2?setPage(1):setPage(2) 
}

const addNewProjectClassification = (e) =>{
  
    e.preventDefault()
   if(!data.name)
    {
     setError('name','Project name Required')
    }
   else if(!data.description)
    {
     setError('description','Description required')   
    }
   else if(data.description.length<100)
    {
     setError('description','Description must be at least 100 characters')   
    } 
    else
    {
        post(route('projectClassification.store'), {
            preserveScroll: true,
            onSuccess: () => {reset()
                setShowPopup(true)
                setIsSuccessPopup(true)
                setTimeout(()=>{setShowSuccessPopup(false)},1000)  
            },
            onError: (errors) => {
                setShowPopup(true)
                setIsSuccessPopup(false)
                setTimeout(()=>{setShowSuccessPopup(false)},1000)   
               console.log(errors)
            },
        });
    }

}

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Project Classification</h2>}
        >
        <Head title="Project Classification" />
        <div onClick={()=>goBack()} className='w-full flex justify-end'>
          <ArrowLeftIcon className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
        </div>
        <Transition
            show={showPopup}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
        >
          {isSuccessPopup ? 
            <p className="text-sm z-10 bg-green-200 text-green-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">Saved.</p>
           :<p className="text-sm z-10 bg-red-200 text-red-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">Something wrong.</p>

          }       
        </Transition>
        {
         page===1?   
        <NewProjClasFormPartOne data={data} setData={(type,val)=>setData(type,val)} clearErrors ={(field)=>clearErrors()} setError={(field,message)=>setError(field,message)} errors={errors} processing={processing}
        movetoPartTwo={(e)=>movetoPartTwo(e)}/>
        :<NewProjClasFormPartTwo data={data} setData={(type,val)=>setData(type,val)} clearErrors ={(field)=>clearErrors()} setError={(field,message)=>setError(field,message)} errors={errors} processing={processing}
        addNewProjectClassification={(e)=>addNewProjectClassification(e)}/>
        }
        </AuthenticatedLayout>
    );
}
