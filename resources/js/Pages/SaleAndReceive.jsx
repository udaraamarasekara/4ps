import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';
import { useRef,useState } from 'react';

import { Head,useForm,router,Link } from '@inertiajs/react';
import { ArrowLeftIcon,ArrowRightIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import SaleAndReceivePartOne from './SaleAndReceivePartOne';
import SaleAndReceivePartTwo from './SaleAndReceivePartTwo';
export default function SaleAndReceive({auth,operation}){
  

    const [page,setPage]=useState(1);   
    const { data, setData, errors, setError,clearErrors,post, reset, processing, recentlySuccessful } = useForm({
     items:[],
     third_party:null 
     
    });
    const movetoPartOne = () => setPage(1)
    const movetoPartTwo = (e) => {
    e.preventDefault()
        if(data.items.length){
      setPage(2)
    }else{
       setError('product_classification_id','You must have at least one product for sale')
    }   
}



    useEffect(()=>{

    },[]) 

 
    const goBack = () => {
    router.visit(route('product.index'))
     }

return (<AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight"> {operation}  items</h2>}
        >
              <Head title= {operation} />
              <div className='w-full flex justify-between'>
           
          <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
          {
            page == 1 &&           <ArrowRightIcon  onClick={(e)=>movetoPartTwo(e)} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />

           }  
        </div>
         {
          page ==1 ? <SaleAndReceivePartOne  processing={processing} errors={errors} data={data} setData={setData} setError={setError} operation={operation} /> 
          :
          <SaleAndReceivePartTwo processing={processing} errors={errors} data={data} setData={setData} setError={setError} operation={operation}/> 
         }
        </AuthenticatedLayout>
             
 );

}