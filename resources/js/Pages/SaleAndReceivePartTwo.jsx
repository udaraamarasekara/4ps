import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { useRef, useState } from "react";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import { useEffect, useCallback } from "react";
import { debounce } from "lodash";
import { router } from "@inertiajs/react";

export default function SaleAndReceivePartTwo({
    setData = () => {},
    errors,
    processing,
    movetoPartOne = () => {},
    clearErrors = () => {},
    setError = () => {},
    data,
    operation,
}) {
    const [suggesioinsThirdParty, setSuggessionsThirdParty] = useState();
    const [addNewThirdParty,setAddNewThirdParty] = useState(true);
    const thirdPartyName = operation=='Sale'?'Customer':'Supplier';
    const [tot, setTot] = useState();
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
            response.data.forEach((preson) => {
                tmpSugests.push(
                    preson.user_name + " " + preson.classification_name
                );
            });
            setSuggessionsThirdParty(tmpSugests);
        }, 300),
        []
    );

    const addNewDeal = (e) => {
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
        post(route("product.store"), {
            onSuccess: () => {
                setAddNewThirdParty(true);
                setSuggessionsThirdParty([]);
                setData({
                    items: [],
                    third_party: null,
                });
                setIsSuccessPopup(true);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            },
            onError: () => {
                setIsSuccessPopup(false);
                setShowPopup(true);
                setTimeout(() => {
                    setShowPopup(false);
                }, 2000);
            },
        });
    };

    useEffect(() => {
        if (isNotInitialMount.current) {
            if (
                !suggesioinsThirdParty?.length &&
                thirdParty.current.value !== "" &&
                prevThirdPartySugst!== data.third_party
            ) {
                addNewThirdParty
                    ? setError(
                          "third_party",
                          "No such a "+thirdPartyName + ". Click to add new "+thirdPartyName
                      )
                    : setError("third_party","No such a "+thirdPartyName)
            } else {
                clearErrors("third_party");
            }
        } else {
            isNotInitialMount.current = true;
        }
        console.log(data.name);
    }, [thirdParty.current?.value]);

    return (
        <div className="w-full pb-6 flex justify-center">
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
                                    setData('third_party',el);
                                    prevThirdPartySugst.current = el;
                                }}
                            />

                           {addNewThirdParty ?
                                                    <div onClick={()=>router.visit(route('people.create'))}>
                                                      <InputError message={errors.third_party} className="mt-2 hover:underline hover:cursor-pointer" /> 
                                                    </div>  
                                                   :<InputError message={errors.third_party} className="mt-2" />
                                                  }
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
    );
}
