import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useCallback, useState } from "react";
import { debounce, set } from "lodash";
import Pagination from "@/Components/Pagination";
import PaginationJson from "@/Components/PaginationJson";
import axios from "axios";
import AutoCompleteTextInput from "@/Components/AutoCompleteTextInput";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PriceCostChart from "./PriceCostChart";
export default function ProfitAndLost({ auth, sold,received }) {
    const [filterChanged, setFilterChanged] = useState(0);
    const [startDateFilter, setStartDateFilter] = useState("");
    const [endDateFilter, setEndDateFilter] = useState("");
    const [jsonPaginate, setJsonPaginate] = useState(false);
    const [productClassificationData, setProductClassificationData] = useState(Object.entries(sold));
    console.log(sold);
    const searchTransactions = async () => {
        setJsonPaginate(true);
        const response = await axios.get(route("transactions.search"), {
            params: {
                startDate: startDateFilter,
                endDate: endDateFilter,
            },
        });
        setTransactionsData(response);
    };
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Profit and Lost
                </h2>
            }
        >
            <Head title="Profit and Lost" />
            <div className="flex justify-center">
                <div className="w-4/5 mx-6 gap-2 flex flex-col md:flex-row items-center justify-between  pt-6">
                    <form
                        method="GET"
                        className="w-full grid grid-cols-1 md:grid-cols-4  items-center flex-col md:flex-row justify-between gap-2"
                        action={route("transactions")}
                    >
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
                        <button
                            onClick={(e) => {
                                e.preventDefault();
                                setFilterChanged(filterChanged + 1);
                            }}
                            type="submit"
                            className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Filter
                        </button>
                        <Link
                            className="max-sm:w-full"
                            href={"/productPriceCostVariationIndex"}
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
                                <th>Item</th>
                                <th>Brand</th>
                                <th>Unit</th>
                                <th>Cost</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Quantity</th>
                                <th>Income</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productClassificationData.map(([key, value]) => {
                                return (
                                    <tr key={key}>
                                        <td className="text-center">
                                            {value.name}
                                        </td>
                                        <td className="text-center">
                                            {value.brand}
                                        </td>
                                        <td className="text-center">
                                            {value.unit}
                                        </td>
                                        <td className="text-center">
                                            {value.unit_cost}
                                        </td>
                                        <td className="text-center">
                                            {value.unit_price}
                                        </td>
                                        <td className="text-center">
                                            {value.category}
                                        </td>
                                        <td className="text-center">
                                            {value.quantity}
                                        </td>
                                        <td className="text-center">
                                            {value.total_income}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </section>
           
            </div>
        </AuthenticatedLayout>
    );
}
