import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link ,useForm} from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon } from '@heroicons/react/24/solid'
import PrimaryButton from '@/Components/PrimaryButton';
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import axios from 'axios';
import { Transition } from '@headlessui/react';
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Pagination from '@/Components/Pagination';
export default function Suppliers({ auth,dealers }) {
   const [show,setShow]=useState(false)
   const [showDelete,setShowDelete]=useState(false)
   const [item,setItem]=useState({})
   const [showPopup,setShowPopup] =useState(false)
   const [isSuccessPopup,setIsSuccessPopup]= useState(true)

  const goBack = () => {
    router.visit(route('product.index'))
     }
   const deleteItem = (id) => {
    axios.delete(route('deleteDealer', id))
        .then(() => {
                        setShowDelete(false)
            setShowPopup(true)
            setIsSuccessPopup(true)
            setTimeout(()=>{setShowPopup(false)},1000)  
            dealers.data=dealers.data.filter(element => element.id !== id);
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
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Suppliers</h2>}
    >
        <Head title="Suppliers" />

         <Modal show={showDelete} onClose={()=>setShowDelete(false)} >
                    <div className='w-full h-auto p-5 flex flex-col items-center'>
                      <div className='font-bold uppercase text-2xl'>Are you sure you want to delete {item.name}?</div>
                      <div className='text-center w-full max-w-[600px] mx-auto break-words whitespace-normal my-4'>
                        This action cannot be undone.
                      </div>
                      <div className='flex gap-4' >
                        <PrimaryButton className='w-min mx-auto mt-3 bg-red-500' onClick={()=>deleteItem(item)} >Delete</PrimaryButton>
                        <PrimaryButton className='w-min mx-auto mt-3' onClick={()=>setShowDelete(false)} >Cancel</PrimaryButton>
        
                      </div>
                    </div>
                </Modal>
        <div className='w-full flex justify-between'>
            <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
            <Link href={route('dealer.create','supplier')}>
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
                     <th>Telephone</th>

                     </tr>
                 </thead>
                 <tbody>
                  { dealers.data.map(object=>{

             return <tr key={object.id}>
                         <td className='text-center'>{object.name}</td>
                         <td className='text-center' >{object.telephone}</td>
                         <td className='flex justify-center gap-5' >
                             <div onClick={()=>router.get(route('dealer.edit',object.id))} className='bg-yellow-500 text-black rounded-full hover:cursor-pointer min-w-5 p-2 min-h-5' ><PencilSquareIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>{setItem(object.id),setShowDelete(true)}} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>

                         </td>
                     </tr>
                  }
                  )
                 }
                 </tbody>
             </table>
            </section>
        
        </div> 
        
    {dealers.meta.links &&
             <div className='mt-4' >
               <Pagination links={dealers.meta.links} />
             </div>
            }
        </AuthenticatedLayout>
    );
}
