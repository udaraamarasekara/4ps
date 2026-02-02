import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm ,router} from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import { Transition } from "@headlessui/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
export default function NewDealer({ auth,type }) {

    const [showPopup,setShowPopup] =useState(false)
const [isSuccessPopup,setIsSuccessPopup]= useState(true)
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        telephone: "",
        type: type,
    });

    // Debounced API call to fetch suggestions
    const NewDealer = useCallback(
        debounce(async (input) => {
            try {
                const response = await axios.post(
                    route("category.fetch", input || "-0"),
                );
            } catch (error) {}
        }, 300),
        [],
    );
 const goBack = () => {
    sessionStorage.getItem('fromDeal')==='saleAndReceive' ? router.visit(type==='customer'?'/sale':'/receive') :
    router.visit(route('dealers.'+ (type==='customer' ? 'customers':'suppliers')))
     }
    // Validate category when user types or API changes

    return (
        <AuthenticatedLayout 
              user={auth.user}
              header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">New {type}</h2>}
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
        <div className="w-full pb-6 flex justify-center">
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    post(route("newDealer"), { onSuccess: () => {setShowPopup(true); setIsSuccessPopup(true); setTimeout(() => setShowPopup(false), 3000); reset();} }); 
                }} className="mt-6 space-y-6">
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        {/* Product Name */}
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="name" value=" Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <InputLabel
                                htmlFor="telephone"
                                value=" Telephone"
                            />
                            <TextInput
                                id="telephone"
                                value={data.telephone}
                                onChange={(e) =>
                                    setData("telephone", e.target.value)
                                }
                                type="text"
                                className="mt-1 block w-full"
                            />
                            <InputError
                                message={errors.telephone}
                                className="mt-2"
                            />
                        </div>
                    </div>

                    {/* Button */}
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            Submit
                        </PrimaryButton>
                    </div>
                </form>
            </section>
        </div>
 
        </AuthenticatedLayout>
    );
}
