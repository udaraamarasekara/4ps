import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link,router } from "@inertiajs/react";
import { useCallback,useState } from "react";
import { debounce } from "lodash";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import Pagination from "@/Components/Pagination";
import axios from "axios";
import { Transition } from "@headlessui/react";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";

export default function ProductFind({ auth }) {
    const [typeFilter, setTypeFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [productsData, setProductsData] = useState([]);
    const [typeSuggestions, setTypeSuggestions] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [showPopup,setShowPopup] =useState(false)
const [isSuccessPopup,setIsSuccessPopup]= useState(true)
    const updateNameSuggestions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("productClassification.getNames", input ? input : "-0")
            );
            setNameSuggestions(response.data);
        }, 300),
        []
    );
    const updateTypeSuggestions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("productClassification.getTypes", input ? input : "-0",nameFilter)
            );
            setTypeSuggestions(response.data);
        }, 300),
        []
    );
  
  const searchProducts = async () => {
    try {
        const response = await axios.get(
            route("productClassification.findProduct"),
            {
                params: {
                    type: typeFilter,
                    name: nameFilter,
                },
            }
        );

        setProductsData(response.data);

    } catch (error) {
        setShowPopup(true);
        setIsSuccessPopup(false);
        setTimeout(() => {
            setShowPopup(false);
        }, 3000);
        // Axios-specific error handling
       
    }
};


   const goBack = () => {
    router.visit(route('product.index'))
     }



    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
Find Products                </h2>
            }
        >
           <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
            <Head title="Find Products" />
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
            <div className="flex justify-center">
                <div className="w-4/5 mx-6 gap-2 flex flex-col md:flex-row items-center justify-between  pt-6">
                    <form
                        method="GET"
                        className="w-full grid grid-cols-1 md:grid-cols-4  items-center flex-col md:flex-row justify-between gap-2"
                        action={route("transactions")}
                    >
                        <div className="w-full">
                            <AutoCompleteTextInput
                                className="w-full"
                                placeholder="Search by name"
                                setClickedElement={(el) => {
                                    setNameFilter(el);
                                }}
                                value={nameFilter}
                                suggestions={nameSuggestions}
                                onChange={(e) => {
                                    updateNameSuggestions(e.target.value),
                                        setNameFilter(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <AutoCompleteTextInput
                                className="w-full"
                                placeholder="Search by value"
                                setClickedElement={(el) => {
                                    setTypeFilter(el);
                                }}
                                value={typeFilter}
                                suggestions={typeSuggestions}
                                onChange={(e) => {
                                    updateTypeSuggestions(e.target.value),
                                        setTypeFilter(e.target.value);
                                }}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault(), searchProducts();
                            }}
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Filter
                        </button>
                        <Link
                            className="max-sm:w-full"
                            href={route("productClassification.findProductView") }
                        >
                            <button className="  py-2 w-full  bg-gray-600 text-white rounded-md hover:bg-gray-700">
                                Clear Filters
                            </button>
                        </Link>
                    </form>
                </div>
            </div>
            <div className="max-sm:w-full pb-6 flex justify-center">
                <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
                    <table className="w-full  ">
                        <thead>
                            <tr>
                                <th>Product name</th>
                                <th>Brand</th>
                                <th>Unit</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Cost</th>
                                <th>Qualities</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productsData?.data?.map((object) => {
                                return (
                                    <tr key={object.id}>
                                        <td className="text-center">
                                            {object.name}
                                        </td>
                                        <td className="text-center">
                                            {object.brand}
                                        </td>
                                        <td className="text-center">
                                            {object.unit}
                                        </td>
                                        <td className="text-center">
                                            {object.category}
                                        </td>
                                        <td className="text-center">
                                            {object.price}
                                        </td>
                                        <td className="text-center">
                                            {object.cost}
                                        </td>
                                        <td className="text-center">
                                            {object.properties
                                                .map(
                                                    (prop) =>
                                                        `${prop.name}: ${prop.type}`
                                                )
                                                .join(", ")}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
            </div>
             {productsData?.links?.length > 3 && (
                    <div className="mt-4">
                        <Pagination links={productsData.links}/>
                    </div>
                )}
        </AuthenticatedLayout>
    );
}
