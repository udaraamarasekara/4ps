import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link } from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon } from '@heroicons/react/24/solid'
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import axios from 'axios';
import { Transition } from '@headlessui/react';

export default function ProductClassification({ auth,productClassifications }) {
   const [show,setShow]=useState(false)
   const [item,setItem]=useState({})
   const [showPopup,setShowPopup] =useState(false)
   const [isSuccessPopup,setIsSuccessPopup]= useState(true)

   const deleteItem = (id) => {
    axios.delete(route('productClassification.destroy', id))
        .then(() => {
            setShowPopup(true)
            setIsSuccessPopup(true)
            setTimeout(()=>{setShowPopup(false)},1000)  
            productClassifications.data=productClassifications.data.filter(element => element.id !== id);
        })
        .catch((e) => {
            setShowPopup(true)
            setIsSuccessPopup(false)
            setTimeout(()=>{setShowPopup(false)},1000)   
          });
     };
    return (
        <AuthenticatedLayout 
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product Classification</h2>}
    >
        <Head title="Product Classification" />
        <div className='w-full flex justify-end'>
            <Link href={route('productClassification.create')}>
                <div className=' m-6 p-6 w-10 h-10 bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' >+</div>
            </Link>
        </div>
  
        <Transition
            show={showPopup}
            enter="transition ease-in-out"
            enterFrom="opacity-0"
            leave="transition ease-in-out"
            leaveTo="opacity-0"
        >
          {isSuccessPopup ? 
            <p className="text-sm z-10 bg-green-200 text-green-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">Done.</p>
           :<p className="text-sm z-10 bg-red-200 text-red-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">Something wrong.</p>

          }       
        </Transition>
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
                     <th>Category</th>
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
                         <td className='text-center'>{object.category}</td>
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
              <div className=' w-4/5 text-center w-full max-w-[600px] mx-auto break-words whitespace-normal'>{item.description}</div>
            </div>
        </Modal>
        </AuthenticatedLayout>
    );
}
