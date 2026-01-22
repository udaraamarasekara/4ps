import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import axios from "axios";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PaginationSession from "@/Components/PaginationSession";
import { set } from "lodash";

export default function ProfitAndLost({
    auth,
    sold,
    received,
    totalSoldPages,
    totalReceivedPages,
    totalIncome,
    totalSpent,
}) {
    // ---------------- STATE ----------------
    const [startDateFilter, setStartDateFilter] = useState("");
    const [totalSoldPagesState, setTotalSoldPagesState] = useState(totalSoldPages);
    const [totalReceivedPagesState, setTotalReceivedPagesState] =
        useState(totalReceivedPages);
    const [currentSoldPageState, setCurrentSoldPageState] = useState(1);
    const [currentReceivedPageState, setCurrentReceivedPageState] = useState(1);
    const [endDateFilter, setEndDateFilter] = useState("");
    const [receivedData, setReceivedData] = useState(Object.values(received));
    const [salesData, setSalesData] = useState(Object.values(sold));
    const [loading, setLoading] = useState(false);

    // ---------------- PAGINATION ----------------
    const changeReceivedPage = async (page) => {
        try {
            setLoading(true);

            const response = await axios.get(
                route("product.receivedPaginate"),
                {
                    params: {
                        page: page,
                        startDate: startDateFilter,
                        endDate: endDateFilter,
                    },
                },
            );

            // Normalize response
            setReceivedData(response.data.received ?? []);
            setCurrentReceivedPageState(response.data.currentReceivedPage);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch received data");
        } finally {
            setLoading(false);
        }
    };

    const changeSoldPage = async (page) => {
        try {
            setLoading(true);

            const response = await axios.get(route("product.soldPaginate"), {
                params: {
                    page: page,
                    startDate: startDateFilter,
                    endDate: endDateFilter,
                },
            });

            // Normalize response
            setSalesData(response.data.sold ?? []);
            setCurrentSoldPageState(response.data.currentSoldPage);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    // ---------------- SEARCH ----------------
    const searchProfitLost = async () => {
        if (!startDateFilter || !endDateFilter) return;

        try {
            setLoading(true);

            const response = await axios.get(
                route("product.profitAndLostGivenDate"),
                {
                    params: {
                        startDate: startDateFilter,
                        endDate: endDateFilter,
                    },
                },
            );

            // Normalize response
            setSalesData(response.data.sold ?? []);
            setReceivedData(response.data.received ?? []);
        } catch (error) {
            console.error(error);
            alert("Failed to fetch profit & loss data");
        } finally {
            setLoading(false);
        }
    };

    // ---------------- UI ----------------
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Profit and Loss
                </h2>
            }
        >
            <Head title="Profit and Loss" />

            {/* ---------------- FILTERS ---------------- */}
            <div className="flex justify-center">
                <div className="w-4/5 mx-6 pt-6">
                    <form
                        className="grid grid-cols-1 md:grid-cols-4 gap-3"
                        onSubmit={(e) => {
                            e.preventDefault();
                            searchProfitLost();
                        }}
                    >
                        <div className="flex items-center">
                            <InputLabel className="mr-2">From</InputLabel>
                            <TextInput
                                type="date"
                                className="w-full"
                                value={startDateFilter}
                                onChange={(e) =>
                                    setStartDateFilter(e.target.value)
                                }
                            />
                        </div>

                        <div className="flex items-center">
                            <InputLabel className="mr-2">To</InputLabel>
                            <TextInput
                                type="date"
                                className="w-full"
                                value={endDateFilter}
                                onChange={(e) =>
                                    setEndDateFilter(e.target.value)
                                }
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? "Filtering..." : "Filter"}
                        </button>

                        <Link href={route("product.profitAndLost")}>
                            <button
                                type="button"
                                className="w-full py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                            >
                                Clear Filters
                            </button>
                        </Link>
                    </form>
                </div>
            </div>

            {/* ---------------- TABLE ---------------- */}
            <div className="flex flex-col">
                <div className="text-2xl text-center">
                    Expenditures in given period by buying: {totalIncome}
                </div>
                <div className="flex justify-center pb-6">
                    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm">
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
                                {salesData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}

                                {salesData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
                                            {item.brand}
                                        </td>
                                        <td className="text-center">
                                            {item.unit}
                                        </td>
                                        <td className="text-center">
                                            {item.unit_cost}
                                        </td>
                                        <td className="text-center">
                                            {item.unit_price}
                                        </td>
                                        <td className="text-center">
                                            {item.category}
                                        </td>
                                        <td className="text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="text-center">
                                            {item.total_income}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>
            {/* ---------------- PAGINATION ---------------- */}
            <PaginationSession
                totalPages={totalSoldPagesState}
                currentPage={currentSoldPageState}
                onPageChange={changeSoldPage}
            />
            {/* ---------------- TABLE ---------------- */}
            <div className="flex flex-col">
                <div className="text-2xl text-center">
                    Expenditures in given period by buying: {totalSpent}
                </div>

                <div className="flex justify-center pb-6">
                    <section className="w-4/5 mx-6 mt-6 px-6 py-4 bg-white dark:bg-gray-800 shadow-md overflow-x-auto sm:rounded-lg">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th>Item</th>
                                    <th>Brand</th>
                                    <th>Unit</th>
                                    <th>Cost</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Quantity</th>
                                    <th>Cost spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receivedData.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-4 text-gray-500"
                                        >
                                            No records found
                                        </td>
                                    </tr>
                                )}

                                {receivedData.map((item, index) => (
                                    <tr key={index}>
                                        <td className="text-center">
                                            {item.name}
                                        </td>
                                        <td className="text-center">
                                            {item.brand}
                                        </td>
                                        <td className="text-center">
                                            {item.unit}
                                        </td>
                                        <td className="text-center">
                                            {item.unit_cost}
                                        </td>
                                        <td className="text-center">
                                            {item.unit_price}
                                        </td>
                                        <td className="text-center">
                                            {item.category}
                                        </td>
                                        <td className="text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="text-center ">
                                            {item.total_spent}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                </div>
            </div>

            {/* ---------------- PAGINATION ---------------- */}
            <PaginationSession
                totalPages={totalReceivedPagesState}
                currentPage={currentReceivedPageState}
                onPageChange={changeReceivedPage}
            />
        </AuthenticatedLayout>
    );
}
