import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link} from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon } from '@heroicons/react/24/solid'
import { useCallback } from 'react';
import { debounce } from 'lodash';
import { useState } from 'react';
import { router } from '@inertiajs/react'
import axios from 'axios';
import AutoCompleteTextInput from '@/Components/AutoCompleteTextInput';

export default function Transactions({ auth, transactions }) {
    const [typeFilter,setTypeFilter]=useState('All Types');
    const [nameFilter,setNameFilter]=useState('');
    const [transactionsData,setTransactionsData]=useState(transactions);
    const [nameSuggestions,setNameSuggestions]=useState([]);
    const[brandFilter,setBrandFilter]=useState('');
    const[categoryFilter,setCategoryFilter]=useState('');
    const [propertyFilter,setPropertyFilter]=useState('');
    const updateNameSuggestions = useCallback(
            debounce(async (input) => {
                const response = await axios.get(
                    route('productClassification.getName', input ? input : "-0")
                );
                setNameSuggestions(
                    response.data
                );

            }, 300),
            []
        );  
const searchTransactions = async () => {
        const response = await axios.get(route('transactions.search'), {
            params: {
                type: typeFilter,
                name: nameFilter,
                brand: brandFilter,
                category: categoryFilter,
                property: propertyFilter,
            },
        });
        setTransactionsData(response.data);
    };

    return (
        <AuthenticatedLayout 
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Transactions Reports</h2>}
    >
        <Head title="Transactions Reports" />
       <div className='flex justify-center'> 
        <div className='w-4/5 mx-6 gap-2 flex flex-col md:flex-row items-center justify-between  pt-6'>
            <form method="GET" className='w-full grid grid-cols-1 md:grid-cols-4  items-center flex-col md:flex-row justify-between gap-2' action={route('transactions')}>
                <select name="type" className='border-gray-300 w-full max-sm:w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 '>
                    <option value="">All Types</option>
                    <option value="sale">Sale</option>
                    <option value="receive">Receive</option>
                </select>
                <div className="w-full" >
                 <AutoCompleteTextInput className="w-full" placeholder="Search by name" value={nameFilter} suggestions={nameSuggestions} onChange={(e) => {updateNameSuggestions(e.target.value),setNameFilter(e.target.value)}} />

                </div>
                <button type="submit" className='w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'>Filter</button>
            <Link className='max-sm:w-full' href={route('transactions')}>
                <button onClick={(e)=>{e.preventDefault()}} className='  py-2 w-full  bg-gray-600 text-white rounded-md hover:bg-gray-700'>Clear Filters</button>
            </Link>
            </form>
            
        </div>
        </div>
        <div className='max-sm:w-full pb-6 flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
            <table className="max-sm:w-full  ">
                 <thead>
                     <tr>
                     <th>Name</th>
                     <th>Type</th>
                     <th>Actions</th>

                     </tr>
                 </thead>
                 <tbody>
                  { transactionsData.data.map(object=>{

             return <tr key={object.id}>
                         <td className='text-center'>{object.name}</td>
                         <td className='text-center' >{object.type}</td>
                         <td className='flex justify-center gap-5' >
                             <div onClick={()=>{setItem(object),setShow(true)}} className='bg-green-400 text-black hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><EyeIcon className='min-w-5 h-auto' /></div>
                             { (object.name !=='Supplier' && object.name !=='Customer' && object.name !=='Employee' )&& <>
                             <div onClick={()=>router.get(route('peopleClassification.edit',object.id))} className='bg-yellow-500 text-black rounded-full hover:cursor-pointer min-w-5 p-2 min-h-5' ><PencilSquareIcon className='min-w-5 h-auto' /></div>
                             <div onClick={()=>deleteItem(object.id)} className='bg-red-500 text-white hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><TrashIcon className='min-w-5 h-auto' /></div>
              </>    }
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