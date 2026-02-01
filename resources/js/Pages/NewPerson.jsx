import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useRef } from "react";
import { useEffect } from "react";
export default function NewPerson({ auth,type }) {
 
    const {
        data,
        setData,
      
        post,
        reset,
        processing,
    } = useForm({
        name: "",
        role: type,
        telephone: null,
    });
   
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccessPopup, setIsSuccessPopup] = useState(true);
    const goBack = () => {
        router.visit(window.history.back());
    };
    const addNewPerson = (e) => {
        e.preventDefault();
        console.log(data)
            post("/new"+type, {
                preserveScroll: true,
                onSuccess: () => {
                    reset();
                    setShowPopup(true);
                    setIsSuccessPopup(true);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 1000);
                },
                onError: (errors) => {
                    setShowPopup(true);
                    setIsSuccessPopup(false);
                    setTimeout(() => {
                        setShowPopup(false);
                    }, 1000);
                    console.log(errors);
                },
            });
        
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    New {type}
                </h2>
            }
        >
            <Head title="People Classification" />
            <div className="w-full flex justify-start">
                <ArrowLeftIcon
                    onClick={() => goBack()}
                    className=" m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer"
                />
            </div>
            <Transition
                show={showPopup}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                {isSuccessPopup ? (
                    <p className="text-sm z-10 bg-green-200 text-green-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">
                        Saved.
                    </p>
                ) : (
                    <p className="text-sm z-10 bg-red-200 text-red-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">
                        Something wrong.
                    </p>
                )}
            </Transition>
            <div className="w-full  pb-6 flex items-center justify-center md:flex-row flex-col">
                <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                    <form
                        onSubmit={(e) => addNewPerson(e)}
                        className="mt-6 space-y-6"
                    >
                        <div className="flex flex-col  md:flex-row md:space-x-4">
                            <div className="w-full  md:w-1/2">
                                <InputLabel htmlFor="name" value="Name" />
                                <TextInput
                                    id="name"
                                    value={data.name}
                                    type="text"
                                    onChange={(e) => setData("name", e.target.value)}
                                    className="mt-1 block w-full"
                                    autoComplete="name"/>

                            </div>
                             <div className="w-full  md:w-1/2">
                                <InputLabel htmlFor="telephone" value="Telephone" />
                                <TextInput
                                    id="telephone"
                                    value={data.telephone}
                                    type="text"
                                    pattern="^07[0-9]{8}$"
                                    onChange={(e) => setData("telephone", e.target.value)}
                                    className="mt-1 block w-full"
                                    autoComplete="telephone"/>

                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <PrimaryButton disabled={processing}>
                                Save
                            </PrimaryButton>
                        </div>
                    </form>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
