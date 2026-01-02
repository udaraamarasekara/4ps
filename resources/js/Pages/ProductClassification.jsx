import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link ,useForm} from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon,CurrencyDollarIcon } from '@heroicons/react/24/solid'
import Modal from '@/Components/Modal';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import axios from 'axios';
import { Transition } from '@headlessui/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function ProductClassification({ auth,productClassifications }) {
   const [show,setShow]=useState(false)
   const [item,setItem]=useState({})
   const [showPopup,setShowPopup] =useState(false)
   const [itemName,setItemName]= useState();
   const [isSuccessPopup,setIsSuccessPopup]= useState(true)
   const [showEditCostPrice,setShowEditCostPrice] = useState(false)
  const { data, setData, errors, setError,clearErrors,post, reset, processing, recentlySuccessful } = useForm({
     id:null,
     price:null,
     cost:null,

    });

   const updateCostPriceItem = (item) =>{
      setData({id:item.id,cost:item.cost,price:item.price})
       sessionStorage.setItem('prevCost',item.cost)
       sessionStorage.setItem('prevPrice',item.price)
      setItemName(item.name)
      setShowEditCostPrice(true)
   }

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

     const updateItemCostPrice = () => 
     { 
      if(data.cost !== sessionStorage.getItem('prevCost') || data.price !== sessionStorage.getItem('prevPrice') )
        {axios.post(route('productClassificationCostPrice'),data).then(() => {
            setShowEditCostPrice(false)
            setShowPopup(true)
            setIsSuccessPopup(true)
            setTimeout(()=>{setShowPopup(false)},1000)  
        })
        .catch((e) => {
            setShowPopup(true)
            setIsSuccessPopup(false)
            setTimeout(()=>{setShowPopup(false)},1000)   
          })}else{ 
            setShowEditCostPrice(false)

            setShowPopup(true)
          setIsSuccessPopup(false)
          setTimeout(()=>{setShowPopup(false)},1000)  ;
          }
        }    
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
                             <div onClick={()=>updateCostPriceItem(object)} className='bg-gray-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><CurrencyDollarIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>deleteItem(object.id)} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>

                         </td>
                     </tr>
                  }
                  )
                 }
                 </tbody>
             </table>
            </section>
            {productClassifications.links.length > 3 &&
             <div className='mt-4' >
               <Pagination links={productClassifications.links} />
             </div>
            }
        </div> 
        <Modal show={show} onClose={()=>setShow(false)} >
            <div className='w-full h-auto p-5 flex flex-col items-center'>
              <div className='font-bold uppercase text-2xl'>{item.name}</div>
              {item.image && <img src={item.image} alt={item.name} className='w-48 h-48 object-cover my-4 rounded-md' />}
              <div className='text-center w-full max-w-[600px] mx-auto break-words whitespace-normal'>
                <div className="grid grid-cols-1  gap-4">
                    {item?.properties?.length ? item.properties.map((prop, index) => (
                    <div
                        key={index}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="flex justify-between items-center">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Name</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">{prop.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Type</p>
                            <p className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">{prop.type}</p>
                        </div>
                        </div>
                    </div>
                    )) : (
                    <div className="col-span-full text-center text-gray-500 dark:text-gray-400 py-6">
                        No properties available
                    </div>
                    )}
              </div>
              </div>
            </div>
        </Modal>
       
        <Modal show={showEditCostPrice} onClose={()=>setShowEditCostPrice(false)} >
            <div className='w-full h-auto p-5 flex flex-col items-center'>
              <div className='font-bold uppercase text-2xl'>{itemName}</div>
              <div className='text-center w-full max-w-[600px] mx-auto break-words whitespace-normal'>
                <div className='flex flex-col md:flex-row md:space-x-4'>
                <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="cost" value="cost" />

                        <TextInput
                            value={data.cost}
                            onChange={(e) => setData('cost', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="cost"
                        />
                    </div>
                    <div className='w-full md:w-1/2' >
                        <InputLabel htmlFor="price" value="price" />

                        <TextInput
                            value={data.price}
                            onChange={(e) => setData('price', e.target.value)}
                            type="text"
                            className="mt-1 block w-full"
                            autoComplete="price"
                        />
                    </div>
                 </div>
                 <PrimaryButton className='w-min mx-auto mt-3' onClick={()=>updateItemCostPrice()} >Save</PrimaryButton>

              </div>
            </div>
        </Modal>

        </AuthenticatedLayout>
    );
}
