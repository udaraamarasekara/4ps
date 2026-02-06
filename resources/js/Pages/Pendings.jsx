import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import { EyeIcon,CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { useForm ,router} from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { Transition } from "@headlessui/react";
import Modal from "@/Components/Modal";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
export default function Pendings({ auth,pendings,type }) {
    sessionStorage.setItem('type',type);
    console.log(pendings.data);
 const goBack = () => {
    router.visit(route('product.index'))
     }
    // Validate category when user types or API changes
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccessPopup, setIsSuccessPopup] = useState(false);
    const [item,setItem]=useState({})
    const [show,setShow]=useState(false)

    const complete= async (object)=>{
        try {
            const res = await axios.post(route('completePending'), {
                id:object.id,
            });
            setIsSuccessPopup(true);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
                router.reload();
            }, 2000);
        } catch (error) {
            setIsSuccessPopup(false);
            setShowPopup(true);
            setTimeout(() => {
                setShowPopup(false);
            }, 2000);
        }
    }
    return (
        <AuthenticatedLayout 
              user={auth.user}
              header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Pending {type==='sale'?'Incomes':'Payments'}</h2>}
          >
                        <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
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

                 <Modal show={show} onClose={()=>setShow(false)} item={item} type={type} >
                    <div  className="p-6 flex flex-col items-center justify-center"> 
                    <p className="text-lg font-semibold mb-4">Pending {type==='sale'?'Income':'Payment'} Complete Payment by paying {item.total_bill - item.paid_amount}</p>
                    <div className="flex mt-4">
                     <PrimaryButton onClick={()=>{complete(item),setShow(false)}} >Complete Payment</PrimaryButton>
                     <PrimaryButton className="ml-4 bg-gray-500 hover:bg-gray-700" onClick={()=>setShow(false)} >Cancel</PrimaryButton>
                    </div>
                    </div>
                </Modal>
                 
        <div className="w-full pb-6 flex justify-center">
           <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
            <table className="w-full  ">
                 <thead>
                     <tr>
                     <th>Date</th>
                     <th>{type==='sale'?'Customer':'Supplier'}</th>
                     <th>Total Bill</th>
                     <th>Paid  Amount</th>
                     <th>Actions</th>

                     </tr>
                 </thead>
                 <tbody>
                  { pendings.data.map(object=>{

             return <tr key={object.id}>
                         <td className='text-center'>{object.deal_date}</td>
                         <td className='text-center' >{object.dealer}</td>
                         <td className='text-center'>{object.total_bill}</td>
                         <td className='text-center'>{object.paid_amount}</td>
                         <td className='flex justify-center gap-5' >
                             <div onClick={()=>{router.visit(route('pending.show',object.id))}} className='bg-green-400 text-black hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><EyeIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>{setItem(object),setShow(true)}} className='bg-gray-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><CurrencyDollarIcon className='min-w-5 h-auto' /></div>
                         </td>
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
