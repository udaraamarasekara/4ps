
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link,useForm,router } from '@inertiajs/react';
import EditProdClasFormPartOne from './EditProdClasPartOne';
import EditProdClasFormPartTwo from './EditProdClasFormPartTwo';
import { Transition } from '@headlessui/react';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
export default function EditProductClassification({ auth,productClassification }) {
    const [page,setPage]=useState(1);   
       const { data, setData, errors, setError,clearErrors,put, reset, processing, recentlySuccessful } = useForm({
           name:productClassification.data.name,
           category_name:productClassification.data.category ,
           properties:productClassification.data.properties,
           brand_name:productClassification.data.brand,
           unit_name:productClassification.data.unit,
           price:productClassification.data.price,
           cost:productClassification.data.cost,
       });
const movetoPartOne = () => setPage(1)
const movetoPartTwo = (e) => {
e.preventDefault()
    if(data.name){
        if( data.category_name) {setPage(2)}else{ setError('category_name','Select a Category') }}else{     setError('name','Name required')}    
}

const [showPopup,setShowPopup] =useState(false)
const [isSuccessPopup,setIsSuccessPopup]= useState(true)
const goBack = () => {
   page===1? router.visit(route('productClassification.index')):page===2?setPage(1):setPage(2) 
}

const editProductClassification = (e) =>{
 
    e.preventDefault()

    if(!data.price)
    {
        setError('price','Price required') 
    }   
    else if(data.price && !data.cost){
        setError('cost','Cost required') 

    }
    else if(!((errors.unit_name && data.unit_name )||(data.brand_name && errors.brand_name))){
        put(route('productClassification.update',productClassification.data.id), {
            preserveScroll: true,
            onSuccess: () => {reset()
                setIsSuccessPopup(true)
                setShowPopup(true)
                setTimeout(()=>{setShowPopup(false)},1000)  
            },
            onError: (errors) => {
                setShowPopup(true)
                setIsSuccessPopup(false)
                setTimeout(()=>{setIsSuccessPopup(false)
                    setShowPopup(false)
                },1000)   
                reset()
                movetoPartOne()
               console.log(errors)
            },
        });
    
    }
}

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Classification</h2>}
        >
        <Head title="Product Classification" />
        <div  className='w-full flex justify-end'>
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
        {
         page===1?   
        <EditProdClasFormPartOne data={data} setData={(type,val)=>setData(type,val)} clearErrors ={(field)=>clearErrors(field)} setError={(field,message)=>setError(field,message)} errors={errors} processing={processing}
        movetoPartTwo={(e)=>movetoPartTwo(e)}/>
        :<EditProdClasFormPartTwo data={data} setData={(type,val)=>setData(type,val)} clearErrors ={(field)=>clearErrors(field)} setError={(field,message)=>setError(field,message)} errors={errors} processing={processing}
        editProductClassification={(e)=>editProductClassification(e)} movetoPartOne={()=>movetoPartOne()}/>
        }
        </AuthenticatedLayout>
    );
}
