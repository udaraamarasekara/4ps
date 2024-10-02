import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link } from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon } from '@heroicons/react/24/solid'
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { router } from '@inertiajs/react'
export default function ProductClassification({ auth,productClassifications }) {
   const [show,setShow]=useState(false)
   const [item,setItem]=useState({})


    const deleteItem = (id) =>{

     }
    return (
        <AuthenticatedLayout 
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Classification</h2>}
    >
        <Head title="Product Classification" />
        <Link href={route('productClassification.create')} className='w-full flex justify-end'>
              <div className=' m-6 p-6 w-10 h-10 bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' >+</div>
        </Link>
    
        <div className='w-full pb-6 flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
            <table className="w-full  ">
                 <thead>
                     <tr>
                     <th>Name</th>
                     <th>Brand</th>
                     <th>Unit</th>
                     <th>Cost</th>
                     <th>Price</th>
                     <th>Parent</th>
                     <th>Actions</th>

                     </tr>
                 </thead>
                 <tbody>
                  { productClassifications.data.map(object=>{

             return <tr key={object.id}>
                         <td className='text-center'>{object.name}</td>
                         <td className='text-center' >{object.brand}</td>
                         <td className='text-center'>{object.unit}</td>
                         <td className='text-center' >{object.cost}</td>
                         <td className='text-center'>{object.price}</td>
                         <td className='text-center'>{object.parent|| 'none'}</td>
                         <td className='flex justify-center gap-5' >
                             <div onClick={()=>{setItem(object),setShow(true)}} className='bg-green-400 text-black hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><EyeIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>router.get(route('productClassification.edit',object.id))} className='bg-yellow-500 text-black rounded-full hover:cursor-pointer min-w-5 p-2 min-h-5' ><PencilSquareIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>deleteItem(object.id)} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>
                         </td>
                     </tr>
                  }
                  )
                 }
                 </tbody>
             </table>
            </section>
        </div> 
        <Modal show={show} onClose={()=>setShow(false)} >
            <div className='w-full h-auto p-5 flex flex-col items-center'>
              <div className='font-bold uppercase text-2xl'>{item.name}</div>
              <div className='text-wrap text-justify'>{item.description}</div>
            </div>
        </Modal>
        </AuthenticatedLayout>
    );
}
