import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import {Link} from '@inertiajs/react';
export default function Product({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product </h2>}
        >
            <Head title="Product " />
           <div className="flex flex-col md:flex-row">
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Sale</div>
                        <Link className='text-sm relative mt-auto mb-2 ml-auto mr-2  opacity-60 hover:underline' href={route('sale')}>more...</Link>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100"> Receive</div>
                        <Link className='text-sm relative mt-auto mb-2 ml-auto mr-2  opacity-60 hover:underline' href={route('receive')}>more...</Link>

                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100"> Stock</div>
                        <Link className='text-sm relative mt-auto mb-2 ml-auto mr-2  opacity-60 hover:underline' href={route('stock')}>more...</Link>
                    </div>
                </div>
                
            </div> 
        </AuthenticatedLayout>
    );
}
