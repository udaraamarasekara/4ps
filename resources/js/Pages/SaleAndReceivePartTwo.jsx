import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import ToggleSwitch from "@/Components/ToggleSwitch";
import { useRef, useState } from "react";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import { useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { router } from "@inertiajs/react";
import axios from "axios";
import { Transition } from "@headlessui/react";
export default function SaleAndReceivePartTwo({
    setData = () => {},
    errors,
    processing,
    movetoPartOne = () => {},
    clearErrors = () => {},
    setError = () => {},
    reset = () => {},
    data,
    operation,
}) {
    const [suggesioinsThirdParty, setSuggessionsThirdParty] = useState();
    const [addNewThirdParty, setAddNewThirdParty] = useState(true);
    const thirdPartyName = operation == "Sale" ? "Customer" : "Supplier";
    const [tot, setTot] = useState();
    const [isTotalPaid, setIsTotalPaid] = useState(false);
    const [isSuccessPopup, setIsSuccessPopup] = useState(true);
    const [showPopup, setShowPopup] = useState(false);
    const thirdPartyObject = useRef([]);
    const [message, setMessage] = useState("");
    useEffect(() => {
        setTot(
            data.items.reduce(
                (t, item) => t + item.quantity * item.priceOrCost,
                0
            )
        );
    });
    const prevThirdPartySugst = useRef();
    const isNotInitialMount = useRef(false);

    const thirdParty = useRef();

    const updateThirdPartySuggessions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("people.thirdPartyFetch", {
                    input: input ? input : "-0",
                    operation,
                })
            );
            var tmpSugests = [];
            thirdPartyObject.current = response.data;
            clearErrors("third_party");
            response.data.forEach((person) => {
                tmpSugests.push(
                    person.user_name + " " + person.classification_name
                );
            });
            setSuggessionsThirdParty(tmpSugests);
        }, 300),
        []
    );

    const setThirdPartyObject = (el) => {
        const selectedThirdParty = thirdPartyObject.current.find(
            (person) =>
                person.user_name + " " + person.classification_name === el
        );
        if (selectedThirdParty) {
            setData("third_party", selectedThirdParty);
            console.log(selectedThirdParty);
        }
    };

    const addNewDeal = async (e) => {
        e.preventDefault();
        clearErrors();
        if (data.third_party === "") {
            setError("third_party", "You must select a " + thirdPartyName);
            return;
        }
        if (data.items.length === 0) {
            setError(
                "product_classification_id",
                "You must have at least one product for sale"
            );
            return;
        }
        if (isTotalPaid && !data.paid_amount) {
            setError("paid_amount", "Paid amount is required");
            return;
        }
        if (isTotalPaid) {
            setData("paid_amount", tot);
        }
        try {
            let response = await axios.post(route("product.store"), data);

            if (response.status === 200) {
                setIsSuccessPopup(true);
                setShowPopup(true);
                setMessage(response.data.message);

                setTimeout(() => {
                    setShowPopup(false);
                    reset();
                    movetoPartOne();

                }, 1000);

            }
        } catch (error) {
            // Axios puts server errors here
            if (error.response) {
                // Laravel usually sends validation errors with 422
                if (error.response.status === 422) {
                    // If it's a validation error
                    let validationErrors = error.response.data.errors;
                    setMessage(
                        Object.values(validationErrors).flat().join(", ")
                    );
                } else {
                    setMessage(
                        error.response.data.message || "Something went wrong"
                    );
                }
            } else {
                setMessage("Network error. Please try again.");
            }

            setIsSuccessPopup(false);
            setShowPopup(true);
            setTimeout(() => {
                setIsSuccessPopup(false);
                setShowPopup(false);
            }, 1000);
        }
    };

    useEffect(() => {
        if (isNotInitialMount.current) {
            if (
                !suggesioinsThirdParty?.length &&
                thirdParty.current.value !== "" &&
                prevThirdPartySugst !== data.third_party
            ) {
                addNewThirdParty
                    ? setError(
                          "third_party",
                          "No such a " +
                              thirdPartyName +
                              ". Click to add new " +
                              thirdPartyName
                      )
                    : setError("third_party", "No such a " + thirdPartyName);
            } else {
                clearErrors("third_party");
            }
        } else {
            isNotInitialMount.current = true;
        }
    }, [thirdParty.current?.value]);

    return (
        <div className="w-full pb-6 flex justify-center">
            <Transition
                show={showPopup}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                {isSuccessPopup ? (
                    <p className="text-sm z-10 bg-green-200 text-green-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">
                        {message ?? "Saved."}
                    </p>
                ) : (
                    <p className="text-sm z-10 bg-red-200 text-red-800 p-4 w-1/3 m-4 fixed top-40  rounded-lg dark:text-gray-400">
                        {message ?? "Something wrong."}
                    </p>
                )}
            </Transition>
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form
                    onSubmit={(e) => addNewDeal(e)}
                    className="mt-6 space-y-6"
                >
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <h3>Your Total Bill is LKR : {tot}</h3>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <InputLabel
                                htmlFor="third_party"
                                value={
                                    operation == "Sale"
                                        ? "Customer"
                                        : "Supplier"
                                }
                            />

                            <AutoCompleteTextInput
                                id="third_party"
                                ref={thirdParty}
                                value={data.third_party}
                                suggestions={suggesioinsThirdParty}
                                onChange={(e) =>
                                    updateThirdPartySuggessions(e.target.value)
                                }
                                className="mt-1 block w-full"
                                setClickedElement={(el) => {
                                    setThirdPartyObject(el);
                                    prevThirdPartySugst.current = el;
                                }}
                            />

                            {addNewThirdParty ? (
                                <div
                                    onClick={() =>
                                        router.visit(route("people.create"))
                                    }
                                >
                                    <InputError
                                        message={errors.third_party}
                                        className="mt-2 hover:underline hover:cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <InputError
                                    message={errors.third_party}
                                    className="mt-2"
                                />
                            )}
                        </div>
                        <div className="w-full md:w-1/2">
                            <InputLabel
                                htmlFor="is_total_paid"
                                value="Not Paid Completely"
                            />
                            <ToggleSwitch
                                enabled={isTotalPaid}
                                setEnabled={setIsTotalPaid}
                            />
                        </div>
                    </div>
                    {isTotalPaid && (
                        <div className="flex flex-col md:flex-row md:space-x-4">
                            <div className="w-full md:w-1/2">
                                <InputLabel
                                    htmlFor="paid_amount"
                                    value="Paid Amount"
                                />
                                <TextInput
                                    id="paid_amount"
                                    value={data.paid_amount}
                                    onChange={(e) =>
                                        setData("paid_amount", e.target.value)
                                    }
                                    className="mt-1 block w-full"
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
    );
}
