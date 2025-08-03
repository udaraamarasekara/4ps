import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, router } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState, useCallback } from "react";
import { debounce } from "lodash";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import { useRef } from "react";
import FileInput from "@/Components/FileInput";
import { useEffect } from "react";
export default function NewPerson({ auth }) {
    const [page, setPage] = useState(1);


    const [userSugges, setUserSugges] = useState();
    const [typeSugges, setTypeSugges] = useState();
    const types = useRef([]);
    const users = useRef([]);
    const {
        data,
        setData,
        errors,
        setError,
        clearErrors,
        post,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        type: "User",
        role: "",
        user: null,
    });
        const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [photo, setPhoto] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const [isSuccessPopup, setIsSuccessPopup] = useState(true);
    const goBack = () => {
        router.visit(route("peopleClassification.index"));
    };
    const updateTypeSuggessions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("peopleClassification.fetch", input ? input : "-0")
            );
            types.current = response.data;
            setTypeSugges(
                response.data.map((row) => {
                    return row.name;
                })
            );
        }, 300),
        []
    );

    const updateUserSuggessions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("people.fetch", input ? input : "-0")
            );
            users.current = response.data;
            response.data &&
            setUserSugges(
                response.data.map((row) => {
                    return row.name;
                })
            );
        }, 300),
        []
    );

    const setUserId = (el) => {
        setData("user",users.current.find((u) => u.name === el).id)

    };

    useEffect(()=>{
      setData("user",{name:name,email:email,address:address,photo:photo}) 
    },[name,email,address,photo])

    const addNewPerson = (e) => {
        e.preventDefault();
        console.log(data)
            post(route("people.store"), {
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
                    New Person
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
                            <div className="w-full z-40 md:w-1/2">
                                <InputLabel htmlFor="role" value="Role" />

                                <AutoCompleteTextInput
                                    id="role"
                                    value={data.role}
                                    suggestions={typeSugges}
                                    onChange={(e) =>
                                        updateTypeSuggessions(e.target.value)
                                    }
                                    className="mt-1   block w-full "
                                    setClickedElement={(el) =>
                                        setData("role", el)
                                    }
                                />
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>
                            <div className="w-full  md:w-1/2">
                                <InputLabel htmlFor="type" value="Type" />

                                <select
                                    id="type"
                                    onChange={(e) =>
                                        setData("type", e.target.value)
                                    }
                                    className="mt-1 block w-full border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm "
                                >
                                    <option value="User">User</option>
                                    <option value="NonUser">Non User</option>
                                </select>
                                <InputError
                                    message={errors.type}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row md:space-x-4">
                            {data.type === "User" ? (
                                <div className="w-full z-9 md:w-1/2">
                                    <InputLabel htmlFor="user" value="User" />

                                    <AutoCompleteTextInput
                                        id="user"
                                        value={data.user}
                                        suggestions={userSugges}
                                        onChange={(e) =>
                                            updateUserSuggessions(
                                                e.target.value
                                            )
                                        }
                                        className="mt-1 block w-full "
                                        setClickedElement={(el) => setUserId(el)}
                                    />
                                    <InputError
                                        message={errors.user}
                                        className="mt-2"
                                    />
                                </div>
                            ) : (
                                <>
                                    {" "}
                                    <div className="w-full md:w-1/2">
                                        <InputLabel
                                            htmlFor="name"
                                            value="Name"
                                        />
                                        <TextInput
                                            id="name"
                                            value={name}
                                            type="text"
                                            onChange={(e) =>
                                                setName(e.target.value)
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="name"
                                        />

                                        <InputError
                                            message={errors.type}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <InputLabel
                                            htmlFor="email"
                                            value="Email"
                                        />
                                        <TextInput
                                            id="email"
                                            value={email}
                                            type="email"
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            className="mt-1 block w-full"
                                            autoComplete="email"
                                        />

                                        <InputError
                                            message={errors.email}
                                            className="mt-2"
                                        />
                                    </div>{" "}
                                </>
                            )}
                        </div>
                        {data.type !== "User" && (
                            <div className="flex flex-col md:flex-row md:space-x-4">
                                <div className="w-full md:w-1/2">
                                    <InputLabel
                                        htmlFor="address"
                                        value="Address"
                                    />
                                    <TextInput
                                        id="address"
                                        value={address}
                                        type="text"
                                        onChange={(e) =>
                                            setAddress(e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        autoComplete="address"
                                    />

                                    <InputError
                                        message={errors.type}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="w-full md:w-1/2">
                                    <InputLabel
                                        htmlFor="br"
                                        value="Select Image (optional)"
                                    />

                                    <FileInput
                                        id="post_image"
                                        name="post_image"
                                        files={photo}
                                        accept="image/png, image/jpeg"
                                        className="mt-1 block w-full"
                                        isFocused={true}
                                        onChange={(e) =>
                                            setPhoto(
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.post_image}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        )}
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
