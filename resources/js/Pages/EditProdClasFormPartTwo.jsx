import axios from "axios";
import { useEffect, useRef, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import NewBrandModal from "./NewBrandModal";
import NewUnitModal from "./NewUnitModal";
import FileInput from "@/Components/FileInput";

export default function EditProdClasFormPartTwo({
    setData,
    errors,
    processing,
    editProductClassification,
    clearErrors,
    setError,
    data,
}) {
    const brand = useRef();
    const unit = useRef();
    const isNotInitialMountBrand = useRef(false);
    const isNotInitialMountUnit = useRef(false);

    const [showBrand, setShowBrand] = useState(false);
    const [showUnit, setShowUnit] = useState(false);
    const [unitSuggestions, setUnitSuggestions] = useState([]);
    const [brandSuggestions, setBrandSuggestions] = useState([]);
    const [addNewBrand, setAddNewBrand] = useState(false);
    const [addNewUnit, setAddNewUnit] = useState(false);

    // Fetch unit suggestions
    const updateUnitSuggestions = async (input) => {
        const response = await axios.get(route("unit.fetch", input || "-0"));
        setUnitSuggestions(response.data[1]);
        setAddNewUnit(response.data[0]);
    };

    // Fetch brand suggestions
    const updateBrandSuggestions = async (input) => {
        const response = await axios.get(route("brand.fetch", input || "-0"));
        setBrandSuggestions(response.data[1]);
        setAddNewBrand(response.data[0]);
    };
 useEffect(() => {
        if (isNotInitialMountBrand.current) {
            if (!brandSuggestions?.length && brand.current?.value !== "") {
                addNewBrand
                    ? setError("brand_name", "No such brand. Click to add new brand")
                    : setError("brand_name", "No such brand");
            } else {
                clearErrors("brand_name");
            }
            
        } else {
            // On first mount, populate initial values
            if (brand.current) { brand.current.value = data.brand_name } else { brand.current.value = "" };
            isNotInitialMountBrand.current = true;
        }
    }, [addNewBrand, brandSuggestions]);

 
    useEffect(() => {
        if (isNotInitialMountUnit.current) {


            if (!unitSuggestions?.length && unit.current?.value !== "") {
                addNewUnit
                    ? setError("unit_name", "No such unit. Click to add new unit")
                    : setError("unit_name", "No such unit");
            } else {
                clearErrors("unit_name");
            }
            
        } else {
            // On first mount, populate initial values
            if (unit.current) { unit.current.value = data.unit_name } else { unit.current.value = "" };
            isNotInitialMountUnit.current = true;
        }
    }, [ unitSuggestions, addNewUnit]);
    // Validate brand/unit existence
    
    return (
        <div className="w-full pb-6 flex justify-center">
            <NewBrandModal show={showBrand} setShow={setShowBrand} />
            <NewUnitModal show={showUnit} setShow={setShowUnit} />

            <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-hidden sm:rounded-lg">
                <form onSubmit={editProductClassification} className="mt-6 space-y-6">
                    
                    {/* Brand + Unit */}
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        {/* Brand */}
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="brand_name" value="Brand (optional)" />
                            <AutoCompleteTextInput
                              key={'brand_name'}
                                id="brand_name"
                                ref={brand}
                                value={data.brand_name}
                                suggestions={brandSuggestions}
                                onChange={(e) => {
                                    setData("brand_name", e.target.value);
                                    updateBrandSuggestions(e.target.value);
                                }}
                                setClickedElement={(el) => setData("brand_name", el)}
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
                                <InputError message={errors.brand_name} className="mt-2" />
                            )}
                        </div>

                        {/* Unit */}
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="unit_name" value="Unit (optional)" />
                            <AutoCompleteTextInput
                                id="unit_name"
                                ref={unit}
                                key={"unit_name"}
                                value={data.unit_name}
                                suggestions={unitSuggestions}
                                onChange={(e) => {
                                    setData("unit_name", e.target.value);
                                    updateUnitSuggestions(e.target.value);
                                }}
                                setClickedElement={(el) => setData("unit_name", el)}
                                className="mt-1 block w-full"
                            />
                            {addNewUnit ? (
                                <div onClick={() => setShowUnit(true)}>
                                    <InputError
                                        message={errors.unit_name}
                                        className="mt-2 hover:underline hover:cursor-pointer"
                                    />
                                </div>
                            ) : (
                                <InputError message={errors.unit_name} className="mt-2" />
                            )}
                        </div>
                    </div>

                    {/* Cost + Price */}
                    <div className="flex flex-col md:flex-row md:space-x-4">
                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="cost" value="Cost" />
                            <TextInput
                                id="cost"
                                type="number"
                                value={data.cost}
                                onChange={(e) => setData("cost", e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.cost} className="mt-2" />
                        </div>

                        <div className="w-full md:w-1/2">
                            <InputLabel htmlFor="price" value="Price" />
                            <TextInput
                                id="price"
                                type="number"
                                value={data.price}
                                onChange={(e) => setData("price", e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.price} className="mt-2" />
                        </div>
                    </div>

                    {/* Image */}
                    <div className="w-full md:w-1/2">
                        <InputLabel htmlFor="image" value="Image (optional)" />
                        <FileInput
                            key={"image"}
                            id="image"
                            url={data.url}
                            accept="image/*"
                            className="mt-1 block w-full"
                            onChange={(e) => setData("image", e.target.files[0])}
                        />
                        <InputError message={errors.image} className="mt-2" />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>Update</PrimaryButton>
                    </div>
                </form>
            </section>
        </div>
    );
}
