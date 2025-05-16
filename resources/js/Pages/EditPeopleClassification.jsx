
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,useForm,router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState, useCallback} from 'react';
import { debounce } from 'lodash';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
import { useRef,useEffect } from 'react';

export default function EditPeopleClassification({ auth,peopleClassification }) {
const typeRef = useRef()
 const [typeSugges,setTypeSugges]= useState()
 const types = useRef([])
    const { data, setData, errors, setError,clearErrors,put, reset, processing, recentlySuccessful } = useForm({
        name:  peopleClassification.data.name,
        type: peopleClassification.data.type_id
      

    });
const [showPopup,setShowPopup] =useState(false)
const [isSuccessPopup,setIsSuccessPopup]= useState(true)
const goBack = () => {
 router.visit(route('peopleClassification.index'))
}
    const updateTypeSuggessions =useCallback(
            debounce(async (input) =>{
        const response = await axios.get(route('peopleClassification.fetch',input ? input: '-0'))
        types.current = response.data
        setTypeSugges(response.data.map((row)=>{
           return row.name
        }))
        
       
      
},300),[])

const setType = (el)=>{
  setData('type',types.current.find(t=>t.name ===el ).id) 
}

useEffect(()=>{
  if( typeRef.current.value == '') {typeRef.current.value = peopleClassification.data.type }   
})

const editPeopleClassification = (e) =>{
  
    e.preventDefault()
   if(!data.name)
    {
     setError('name','Name Required')
    }
   else if(!data.type)
    {
     setError('type','Type required')   
    }
    else
    {
        put(route('peopleClassification.update',peopleClassification.data.id), {
            preserveScroll: true,
            onSuccess: () => {
                setShowPopup(true)
                setIsSuccessPopup(true)
                setTimeout(()=>{setShowPopup(false)},1000)  
            },
            onError: (errors) => {
                setShowPopup(true)
                setIsSuccessPopup(false)
                setTimeout(()=>{setShowPopup(false)},1000)   
               console.log(errors)
            },
        });
    }

}

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">People Classification</h2>}
        >
        <Head title="People Classification" />
        <div  className='w-full flex justify-start'>
          <ArrowLeftIcon onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
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
       <div className='w-full pb-6 flex items-center justify-center md:flex-row flex-col'>
       <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
           <form onSubmit={(e)=>editPeopleClassification(e)} className="mt-6 space-y-6">
                   <div className='flex flex-col md:flex-row md:space-x-4'>
                       <div className='w-full md:w-1/2' >
                           <InputLabel htmlFor="type" value="Type" />
       
                           <AutoCompleteTextInput
                               id="type"
                               value={data.type}
                               ref={typeRef}
                               suggestions={typeSugges}
                               onChange={(e) => updateTypeSuggessions(e.target.value)}
                               className="mt-1 block w-full"
                               setClickedElement={(el) =>setType(el)}
                           />
       
                           <InputError message={errors.type} className="mt-2" />
                       </div>
                       <div className='w-full md:w-1/2' >
                           <InputLabel htmlFor="name" value="name" />
       
                              <TextInput
                               id="name"
                               value={data.name}
                               type="text"
                               onChange={(e)=>setData('name',e.target.value)}
                               className="mt-1 block w-full"
                               autoComplete="name"
                           />
       
                           <InputError message={errors.name} className="mt-2" />
                       </div>
                   </div>
                   <div className="flex items-center gap-4">
                       <PrimaryButton 
                   
                       disabled={processing}>Save</PrimaryButton>
                   
                   </div>
           </form>
       </section>
       </div>
        </AuthenticatedLayout>
    );
}
