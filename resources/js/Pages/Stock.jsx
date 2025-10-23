import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link ,useForm} from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon,ArrowLeftIcon } from '@heroicons/react/24/solid'
import { useState } from 'react';
import { router } from '@inertiajs/react'


export default function Stock({ auth,currentStock }) {
   const [show,setShow]=useState(false)
   const [item,setItem]=useState({})
   const [currentStockData,setCurrentStockData]=useState(currentStock)

    return (
        <AuthenticatedLayout 
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Stock</h2>}
    >
        <Head title="Stock" />
        <div className='w-full flex justify-end'>
          <ArrowLeftIcon  onClick={()=>router.visit('/product')} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
        </div>
        <div className='w-full pb-6 flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
            <table className="w-full  ">
                 <thead>
                     <tr>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Brand</th>
                        <th>Unit</th>
                        <th>Stock</th>
                     </tr>
                 </thead>
                 <tbody>
                  { currentStockData.data.map(object=>{

             return <tr key={object.id}>
                         <td className='text-center'>{object.name}</td>
                         <td className='text-center' >{object.category}</td>
                         <td className='text-center' >{object.brand}</td>
                         <td className='text-center' >{object.unit}</td>
                         <td className='text-center' >{object.stock}</td>


                     </tr>
                  }
                  )
                 }
                 </tbody>
             </table>
            </section>
        </div> 
       
        </AuthenticatedLayout>
    );
}