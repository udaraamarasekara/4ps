import axios from "axios";
import { useRef, useState, useEffect, useCallback } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useForm ,router} from "@inertiajs/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { debounce } from "lodash";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
export default function NewDealer({ auth,type }) {
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
    router.visit(route('product.create'))
     }
    // Validate category when user types or API changes

    return (
        <AuthenticatedLayout 
              user={auth.user}
              header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">New {type}</h2>}
          >
                        <ArrowLeftIcon  onClick={()=>goBack()} className=' m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer' />
            
        <div className="w-full pb-6 flex justify-center">
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form className="mt-6 space-y-6">
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
