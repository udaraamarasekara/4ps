import axios from "axios";
import { useEffect, useRef, useState, useCallback } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import NewBrandModal from "./NewBrandModal";
import NewUnitModal from "./NewUnitModal";
import { debounce } from "lodash";
import FileInput from "@/Components/FileInput";
export default function NewProdClasFormPartTwo({
    setData = () => {},
    errors,
    processing,
    addNewProductClassification = () => {},
    clearErrors = () => {},
    setError = () => {},
    data,
}) {
    const brand = useRef();
    const unit = useRef();
    const cost = useRef();
    const price = useRef();
    const prevUnitSugst = useRef();
    const prevBrandSugst = useRef();
    const isNotInitialMount = useRef(false);

    const [showBrand, setShowBrand] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [unitSuggessioins, setUnitSuggessions] = useState();
    const [brandSuggessioins, setBrandSuggessions] = useState();
    const [addNewBrand, setAddNewBrand] = useState(false);
    const [addNewUnit, setAddNewUnit] = useState(false);
    const updateUnitSuggessions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("unit.fetch", input ? input : "-0")
            );
            setUnitSuggessions(response.data[1]);
            setAddNewUnit(response.data[0]);
            console.log(unitSuggessioins);
        }, 300),
        []
    );

    const updateBrandSuggessions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("brand.fetch", input ? input : "-0")
            );
            setBrandSuggessions(response.data[1]);
            setAddNewBrand(response.data[0]);

            console.log(brandSuggessioins);
        }, 300),
        []
    );

    useEffect(() => {
        if (isNotInitialMount.current) {
            if (
                !brandSuggessioins?.length &&
                brand.current.value !== "" &&
                prevBrandSugst !== data.brand
            ) {
                addNewBrand
                    ? setError(
                          "brand_name",
                          "No such a Brand. Click to add new brand"
                      )
                    : setError("brand_name", "No such a Brand");
            } else {
                clearErrors("brand_name");
            }
            if (
                !unitSuggessioins?.length &&
                unit.current.value !== "" &&
                prevUnitSugst !== data.unit
            ) {
                addNewUnit
                    ? setError(
                          "unit_name",
                          "No such a Unit. Click to add new unit"
                      )
                    : setError("unit_name", "No such a Unit");
            } else {
                clearErrors("unit_name");
            }
        } else {
            isNotInitialMount.current = true;
        }
    }, [addNewBrand, addNewUnit, unit.current?.value, brand.current?.value]);

    return (
        <div className="w-full pb-6 flex justify-center">
            <NewBrandModal show={showBrand} setShow={setShowBrand} />
            <NewUnitModal show={showModal} setShow={setShowModal} />
            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form
                    onSubmit={(e) => addNewProductClassification(e)}
                    className="mt-6 space-y-6"
                >
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <InputLabel
                                htmlFor="brand_name "
                                value="Brand (optional)"
                            />
   
                            <AutoCompleteTextInput
                                id="brand_name"
                                ref={brand}
                                value={data.brand_name}
                                suggestions={brandSuggessioins}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    setData('brand_name', input);
                                    updateBrandSuggessions(input);
                                }}
                                setClickedElement={(el) =>
                                    setData("brand_name", el)
                                }
                                className="mt-1 block w-full"
                            />
                            {addNewBrand ? (
                                <div onClick={() => setShowBrand(true)}>
                                    <InputError
                                        message={errors.brand_name}
                                        className="mt-2 hover:underline hover:cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <InputError
                                    message={errors.brand_name}
                                    className="mt-2"
                                />
                            )}
                        </div>

                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="unit_name" value="Unit" />
                            <AutoCompleteTextInput
                                id="unit_name"
                                ref={unit}
                                value={data.unit_name}
                                suggestions={unitSuggessioins}
                                onChange={(e) => {
                                    const input = e.target.value;
                                    setData('unit_name', input);
                                    updateUnitSuggessions(input);
                                }}
                                setClickedElement={(el) => {
                                    setData("unit_name", el);
                                    prevUnitSugst.current = el;
                                }}
                                className="mt-1 block w-full"
                            />
                            {addNewUnit ? (
                                <div onClick={() => setShowModal(true)}>
                                    <InputError
                                        message={errors.unit_name}
                                        className="mt-2 hover:underline hover:cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <InputError
                                    message={errors.unit_name}
                                    className="mt-2"
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="cost" value="Cost" />

                            <TextInput
                                id="cost"
                                value={data.cost}
                                ref={cost}
                                type="number"
                                step="2"
                                onChange={(e) =>
                                    setData("cost", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />

                            <InputError
                                message={errors.cost}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="price" value="price" />

                            <TextInput
                                id="price"
                                value={data.price}
                                ref={price}
                                type="number"
                                step="2"
                                onChange={(e) =>
                                    setData("price", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />

                            <InputError
                                message={errors.price}
                                className="mt-2"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="initialStock" value="Current Stock (optional)" />

                            <TextInput
                                id="cost"
                                value={data.initial_stock_quantity}
                                type="number"
                                onChange={(e) =>
                                    setData("initial_stock_quantity", e.target.value)
                                }
                                className="mt-1 block w-full"
                            />

                            <InputError
                                message={errors.cost}
                                className="mt-2"
                            />
                        </div>
                         <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="image" value="Image (optional)" />

                            <FileInput
                                id="image"
                                onChange={(e) =>
                                    setData("image", e.target.files[0])
                                }
                                className="mt-1 block w-full"
                                accept="image/*"
                            />

                            <InputError
                                message={errors.image}
                                className="mt-2"
                            />
                        </div>
                      </div>  
                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Add</PrimaryButton>
                    </div>
                </form>
            </section>
        </div>
    );
}
