import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />
           <div className="flex flex-col md:flex-row">
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Project Classifications</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Product Classifications</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Property Classifications</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">People Classifications</div>
                    </div>
                </div>
                
            </div> 
            <div className="flex flex-col md:flex-row">
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4 mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Projects</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Products</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Properties</div>
                    </div>
                </div>
                <div className="max-w-7xl py-3 md:py-12 w-4/5 md:w-1/4  mx-auto sm:px-6 lg:px-8">
                    <div className="bg-cyan-300 min-h-40 flex items-center justify-center dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-2xl font-bold text-gray-900 dark:text-gray-100">People</div>
                    </div>
                </div>
                
            </div> 
        </AuthenticatedLayout>
    );
}
