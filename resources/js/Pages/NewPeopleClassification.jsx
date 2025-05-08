
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,useForm,router } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
export default function NewPeopleClassification({ auth }) {

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
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Project Classification</h2>}
        >
        <Head title="Project Classification" />
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
           <form onSubmit={(e)=>e.preventDefault()} className="mt-6 space-y-6">
                   <div className='flex flex-col md:flex-row md:space-x-4'>
                       <div className='w-full md:w-1/2' >
                           <InputLabel htmlFor="product_classification" value="Product Class" />
       
                           <AutoCompleteTextInput
                               id="product_classification"
                               ref={productClassification}
                               value={singleItemToDeal.product_classification_id}
                               suggestions={suggessioinsProdClas}
                               onChange={(e) => updateProductClassificationSuggessions(e.target.value)}
                               className="mt-1 block w-full"
                               setClickedElement={(el) => setClickedProdClas(el)}
                               
                           />
       
                           <InputError message={errors.product_classification_id} className="mt-2" />
                       </div>
                       <div className='w-full md:w-1/2' >
                           <InputLabel htmlFor="quantity" value="Quantity" />
       
                              <TextInput
                               id="quantity"
                               ref={quantity}
                               value={singleItemToDeal.quantity}
                               type="text"
                               onChange={(e)=>setSingleItemToDeal(prev=>({...prev,quantity:e.target.value}))}
                               className="mt-1 block w-full"
                               autoComplete="quantity"
                           />
       
                           <InputError message={errors.quantity} className="mt-2" />
                       </div>
                   </div>
                   <div className="flex items-center gap-4">
                       <PrimaryButton 
                    onClick={() => {
                       if(singleItemToDeal.product_classification_id)
                       {    
                       if(singleItemToDeal.quantity)
                        {       
                       setData(prev => {
                         const isItemExists = prev.items.some(item => item.id === singleItemToDeal.id);
                     
                         if (isItemExists) return prev;
                     
                         return {
                           ...prev,
                           items: [...prev.items, singleItemToDeal],
                         };
                       });
                     }else{
                        setError('quantity','you must select a quantity')
                     }}else{
                         setError('product_classification_id','you must enter product')
                     }
                   }
                   }
                     
                       disabled={processing}>Save</PrimaryButton>
                   
                   </div>
           </form>
       </section><ProductCart products={data.items} setProducts={(id)=>  {setData(prev =>({...prev, items:prev.items.filter((item) => item.product_classification_id !== id)}))}}/>
       </div>
        </AuthenticatedLayout>
    );
}
