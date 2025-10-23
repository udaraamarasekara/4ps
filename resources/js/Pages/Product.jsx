import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react'
export default function Product({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Product </h2>}
        >
            <Head title="Product " />
           <div className="flex flex-col md:flex-row">
                <div onClick={() => router.visit(route('sale'))} className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Sale</div>
                    </div>
                </div>
                <div onClick={() => router.visit(route('receive'))} className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100"> Receive</div>
                    </div>
                </div>
                <div onClick={() => router.visit(route('stock'))} className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100"> Stock</div>
                    </div>
                </div>
                <div onClick={() => router.visit(route('transactions'))} className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex flex-col items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100"> Transactions</div>
                    </div>
                </div>
                
            </div> 
        </AuthenticatedLayout>
    );
}
