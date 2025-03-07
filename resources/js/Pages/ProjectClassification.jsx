import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head,Link } from '@inertiajs/react';
import { PencilSquareIcon,TrashIcon,EyeIcon } from '@heroicons/react/24/solid'
export default function ProjectClassification({ auth,projectClassifications }) {


    const deleteItem = (id) =>{

     }
    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Project Classification</h2>}
    >
        <Head title="Project Classification" />
        <div className='w-full flex justify-end' >
            <Link href={route('projectClassification.create')}>
                <div className=' m-6 p-6 w-10 h-10 bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' >+</div>
            </Link>
        </div>
    
    
        <div className='w-full pb-6 flex justify-center'>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
            <table className="w-full  ">
                 <thead>
                     <tr>
                     <th>Name</th>
                     <th>Description</th>
                     <th>Parent</th>
                     <th>Actions</th>

                     </tr>
                 </thead>
                 <tbody>
                  { projectClassifications.data.map(object=>{

                     return <tr key={object.id}>
                         <td className='flex justify-center' >{object.name}</td>
                         <td className='max-w-2 overflow-hidden'>{object.description}</td>
                         <td >{object.parent}</td>
                         <td className='flex justify-center gap-5' >
                             <div className='bg-green-400 text-black hover:cursor-pointer rounded-full min-w-5 p-2 min-h-5' ><EyeIcon className='min-w-5 h-auto' /></div>
                             <div className='bg-yellow-500 text-black rounded-full hover:cursor-pointer min-w-5 p-2 min-h-5' ><PencilSquareIcon className='min-w-5 h-auto' /></div>
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
        </AuthenticatedLayout>
    );
}
