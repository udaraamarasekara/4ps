import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import { useRef,useState } from 'react';
import TextInput from '@/Components/TextInput';
import { TrashIcon } from '@heroicons/react/24/solid';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';
export default function ProductCart({products,setProducts=()=>{}}){
 



return (<div className='w-full pb-6 flex justify-center'>
<section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
<table className="w-full  ">
                 <thead>
                     <tr>
                     <th>Name</th>
                     <th>Unit</th>
                     <th>Quantity</th>
                     <th>UnitPrice</th>
                     <th>Total</th>
                     <th>Actions</th>
                     </tr>
                 </thead>
                 <tbody>
                  { products?.map(object=>{

             return <tr key={object.product_classification_id}>
                         <td className='text-center'>{object.name}</td>
                         <td className='text-center'>{object.unit}</td>
                         <td className='text-center' >{object.quantity}</td>
                         <td className='text-center'>{object.priceOrCost}</td>
                         <td className='text-center'>{object.quantity*object.priceOrCost}</td>
                         <td className='flex justify-center   gap-5' >
                             <div onClick={()=>setProducts(object.product_classification_id)} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>
                         </td>
                     </tr>
                  }
                  )
                 }
                 </tbody>
             </table>
</section>
</div>);
}