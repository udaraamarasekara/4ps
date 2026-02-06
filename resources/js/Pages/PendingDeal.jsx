import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head,router } from "@inertiajs/react";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Pagination from "@/Components/Pagination";
import PaginationJson from "@/Components/PaginationJson";

export default function PendingDeal({ auth, transactions }) {
    
   const type = sessionStorage.getItem('type')==='sale'?'income':'payment';

    const goBack = () => {
    router.visit(route('pendings', {type: type}))
     }
    


    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Transactions Report
                </h2>
            }
        >
           <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
            <Head title="Transactions Report" />
            
            <div className="max-sm:w-full pb-6 flex justify-center">
                <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
                    <table className="w-full  ">
                        <thead>
                            <tr>
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Date</th>
                                <th>Product name</th>
                                <th>Brand</th>
                                <th>Unit</th>
                                <th>Category</th>
                                <th>Price/Cost</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.data.map((object) => {
                                return object.product_items?.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center">
                                            {object.id}
                                        </td>
                                        <td className="text-center">
                                            {object.deal_type}
                                        </td>
                                         <td className="text-center">
                                            {
                                                item.created_at.split('T')[0]
                                            }
                                        </td>
                                        <td className="text-center">
                                            {item.product_classification.name}
                                        </td>
                                        <td className="text-center">
                                            {
                                                item.product_classification
                                                    .brand.name
                                            }
                                        </td>
                                        <td className="text-center">
                                            {
                                                item.product_classification.unit
                                                    .name
                                            }
                                        </td>
                                        <td className="text-center">
                                            {
                                                item.product_classification
                                                    .category.name
                                            }
                                        </td>
                                        <td className="text-center">
                                            {object.deal_type === "sale"
                                                ? item.product_classification
                                                      .latest_product_value_variation
                                                      .price
                                                : item.product_classification
                                                      .latest_product_value_variation
                                                      .cost}
                                        </td>
                                        <td className="text-center">
                                            {item.quantity}
                                        </td>
                                    </tr>
                                ));
                            })}
                        </tbody>
                    </table>
                </section>
               
            </div>
             {transactions.links.length > 3 && (
                    <div className="mt-4">
                     {jsonPaginate ? <PaginationJson links={transactionsData.links} setData={(data)=>setTransactionsData(data.data)} typeFilter={typeFilter} nameFilter={nameFilter} brandFilter={brandFilter} categoryFilter={categoryFilter} propertyFilter={propertyFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} /> : <Pagination links={transactionsData.links} />}
                    </div>
                )}
        </AuthenticatedLayout>
    );
}
