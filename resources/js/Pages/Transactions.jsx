import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useCallback,useState } from "react";
import { debounce, set } from "lodash";
import Pagination from "@/Components/Pagination";
import PaginationJson from "@/Components/PaginationJson";
import axios from "axios";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
export default function Transactions({ auth, transactions }) {
    const [typeFilter, setTypeFilter] = useState("");
    const [nameFilter, setNameFilter] = useState("");
    const [jsonPaginate, setJsonPaginate] = useState(false);
    const [transactionsData, setTransactionsData] = useState(transactions);
    const [brandSuggestions, setBrandSuggestions] = useState([]);
    const [nameSuggestions, setNameSuggestions] = useState([]);
    const [categorySuggestions, setCategorySuggestions] = useState([]);
    const [propertySuggestions, setPropertySuggestions] = useState([]);
    const [brandFilter, setBrandFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [propertyFilter, setPropertyFilter] = useState();
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const updateNameSuggestions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("productClassification.getName", input ? input : "-0")
            );
            setNameSuggestions(response.data);
        }, 300),
        []
    );
    const updateBrandSuggestions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("brand.fetchRow", input ? input : "-0")
            );
            setBrandSuggestions(response.data);
        }, 300),
        []
    );
    const updateCategorySuggestions = useCallback(
        debounce(async (input) => {
            const response = await axios.get(
                route("category.fetch", input ? input : "-0")
            );
            setCategorySuggestions(response.data);
        }, 300),
        []
    );
    const searchTransactions = async () => {
        setJsonPaginate(true);
        const response = await axios.get(route("transactions.search"), {
            params: {
                type: typeFilter,
                name: nameFilter,
                brand: brandFilter,
                category: categoryFilter,
                property: propertyFilter,
                startDate: startDateFilter,
                endDate: endDateFilter,
            },
        });
        setTransactionsData(response.data);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Transactions Reports
                </h2>
            }
        >
            <Head title="Transactions Reports" />
            <div className="flex justify-center">
                <div className="w-4/5 mx-6 gap-2 flex flex-col md:flex-row items-center justify-between  pt-6">
                    <form
                        method="GET"
                        className="w-full grid grid-cols-1 md:grid-cols-4  items-center flex-col md:flex-row justify-between gap-2"
                        action={route("transactions")}
                    >
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                            name="type"
                            placeholder="All Types"
                            className="border-gray-300 w-full max-sm:w-full dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 rounded-md shadow-sm  focus:ring-indigo-500 focus:border-indigo-500 "
                        >
                            <option value="">All Types</option>
                            <option value="sale">Sale</option>
                            <option value="receive">Receive</option>
                        </select>
                        <div className="w-full  flex flex-row justify-between">
                            <InputLabel className="mr-2 mt-2">From</InputLabel>
                            <TextInput
                                className="w-full"
                                placeholder="Search by Start Date"
                                type="date"
                                value={startDateFilter}
                                onChange={(e) => {
                                    setStartDateFilter(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-full flex flex-row justify-between">
                            <InputLabel className="mr-2 mt-2">To</InputLabel>
                            <TextInput
                                type="date"
                                className="w-full"
                                placeholder="Search by End Date"
                                value={endDateFilter}
                                onChange={(e) => {
                                    setEndDateFilter(e.target.value);
                                }}
                            />
                        </div>
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
                                placeholder="Search by brand"
                                setClickedElement={(el) => {
                                    setBrandFilter(el);
                                }}
                                value={brandFilter}
                                suggestions={brandSuggestions}
                                onChange={(e) => {
                                    updateBrandSuggestions(e.target.value),
                                        setBrandFilter(e.target.value);
                                }}
                            />
                        </div>
                        <div className="w-full">
                            <AutoCompleteTextInput
                                className="w-full"
                                placeholder="Search by category"
                                setClickedElement={(el) => {
                                    setCategoryFilter(el);
                                }}
                                value={categoryFilter}
                                suggestions={categorySuggestions}
                                onChange={(e) => {
                                    updateCategorySuggestions(e.target.value),
                                        setCategoryFilter(e.target.value);
                                }}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                e.preventDefault(), searchTransactions();
                            }}
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Filter
                        </button>
                        <Link
                            className="max-sm:w-full"
                            href={route("transactions")}
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
                                <th>Transaction ID</th>
                                <th>Type</th>
                                <th>Customer/Supplier</th>
                                <th>Product name</th>
                                <th>Brand</th>
                                <th>Unit</th>
                                <th>Category</th>
                                <th>Price/Cost</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactionsData.data.map((object) => {
                                return object.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="text-center">
                                            {object.id}
                                        </td>
                                        <td className="text-center">
                                            {object.deal_type}
                                        </td>
                                        <td className="text-center">
                                            {object.peopleable.name}
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
             {transactionsData.links.length > 3 && (
                    <div className="mt-4">
                     {jsonPaginate ? <PaginationJson links={transactionsData.links} setData={(data)=>setTransactionsData(data.data)} typeFilter={typeFilter} nameFilter={nameFilter} brandFilter={brandFilter} categoryFilter={categoryFilter} propertyFilter={propertyFilter} startDateFilter={startDateFilter} endDateFilter={endDateFilter} /> : <Pagination links={transactionsData.links} />}
                    </div>
                )}
        </AuthenticatedLayout>
    );
}
