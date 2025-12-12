import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import EditProdClasFormPartOne from "./EditProdClasPartOne";
import EditProdClasFormPartTwo from "./EditProdClasFormPartTwo";
import { Transition } from "@headlessui/react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";

export default function EditProductClassification({
    auth,
    productClassification,
}) {
    const [page, setPage] = useState(1);
    const [popupState, setPopupState] = useState({
        show: false,
        type: null, // 'success' or 'error'
    });
    const [timeoutId, setTimeoutId] = useState(null);

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
        _method: 'PUT',
        name: productClassification.data.name || '',
        category_name: productClassification.data.category || '',
        properties: productClassification.data.properties || '',
        brand_name: productClassification.data.brand || '',
        unit_name: productClassification.data.unit || '',
        price: productClassification.data.price || '',
        cost: productClassification.data.cost || '',
        url: productClassification.data.image || '',
        image: null,
    });

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [timeoutId]);

    const showNotification = (type) => {
        // Clear any existing timeout
        if (timeoutId) {
            clearTimeout(timeoutId);
        }

        setPopupState({ show: true, type });
        const id = setTimeout(() => {
            setPopupState({ show: false, type: null });
            setTimeoutId(null);
        }, 3000);
        setTimeoutId(id);
    };

    const movetoPartOne = () => {
        clearErrors();
        setPage(1);
    };

    const movetoPartTwo = (e) => {
        e.preventDefault();
        clearErrors();

        // Validate required fields
        let hasErrors = false;

        if (!data.name) {
            setError("name", "Name required");
            hasErrors = true;
        }

        if (!data.category_name) {
            setError("category_name", "Select a Category");
            hasErrors = true;
        }

        if (!hasErrors) {
            setPage(2);
        }
    };

    const goBack = () => {
        clearErrors();
        
        if (page === 1) {
            router.visit(route("productClassification.index"));
        } else {
            setPage(page - 1);
        }
    };

    const editProductClassification = (e) => {
        e.preventDefault();

        // Validate required fields
        let hasErrors = false;

        if (!data.price) {
            setError("price", "Price required");
            hasErrors = true;
        }

        if (!data.cost) {
            setError("cost", "Cost required");
            hasErrors = true;
        }

        // Only submit if no validation errors
        if (hasErrors) {
            return;
        }

        // Submit the form using POST with _method spoofing for Laravel
        post(
            route(
                "productClassification.update",
                productClassification.data.id
            ),
            {
                forceFormData: true,
                preserveScroll: true,
                onBefore: () => {
                    // Debug: Log data being sent
                    console.log('Sending data:', data);
                },
                onSuccess: () => {
                    showNotification('success');
                    movetoPartOne();
                    reset();
                },
                onError: (serverErrors) => {
                    showNotification('error');
                    console.error("Update errors:", serverErrors);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Product Classification
                </h2>
            }
        >
            <Head title="Product Classification" />
            
            <div className="w-full flex justify-end">
                <ArrowLeftIcon
                    onClick={goBack}
                    className="m-6 bold p-3 w-12 h-auto bg-white border border-gray-200 rounded-full text-3xl font-extrabold flex items-center justify-center hover:cursor-pointer transition-colors hover:bg-gray-50"
                />
            </div>

            <Transition
                show={popupState.show}
                enter="transition ease-in-out duration-300"
                enterFrom="opacity-0 translate-y-2"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in-out duration-300"
                leaveTo="opacity-0 translate-y-2"
            >
                {popupState.type === 'success' ? (
                    <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
                        <div className="bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg">
                            <p className="font-medium">Success!</p>
                            <p className="text-sm">Product classification updated successfully.</p>
                        </div>
                    </div>
                ) : popupState.type === 'error' ? (
                    <div className="fixed top-40 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md mx-4">
                        <div className="bg-red-100 border border-red-400 text-red-800 px-4 py-3 rounded-lg shadow-lg">
                            <p className="font-medium">Error!</p>
                            <p className="text-sm">Something went wrong. Please try again.</p>
                        </div>
                    </div>
                ) : null}
            </Transition>

            {page === 1 ? (
                <EditProdClasFormPartOne
                    data={data}
                    setData={setData}
                    clearErrors={clearErrors}
                    setError={setError}
                    errors={errors}
                    processing={processing}
                    movetoPartTwo={movetoPartTwo}
                />
            ) : (
                <EditProdClasFormPartTwo
                    data={data}
                    setData={setData}
                    clearErrors={clearErrors}
                    setError={setError}
                    errors={errors}
                    processing={processing}
                    editProductClassification={editProductClassification}
                    movetoPartOne={movetoPartOne}
                />
            )}
        </AuthenticatedLayout>
    );
}