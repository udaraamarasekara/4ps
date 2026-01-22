import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/solid";

export default function PaginationSession({ currentPage = 1, totalPages = 1, onPageChange = (page) => {} }) {
    console.log("PaginationSession rendered with:", { currentPage, totalPages });
    const base =
        "inline-flex items-center justify-center px-3 py-2 rounded-lg border text-xs transition";

    return (
        <nav className="mt-4 flex justify-center gap-2">
            {/* Prev */}
            <button
                disabled={currentPage === 1 || totalPages === 0}
                onClick={() => onPageChange(currentPage - 1)}
                className={`${base} ${
                    currentPage === 1 || totalPages === 0
                        ? "border-gray-300 text-gray-300 cursor-not-allowed"
                        : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
            >
                <ArrowLeftIcon className="w-4 h-4" />
            </button>

            {/* Next */}
            <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => onPageChange(currentPage + 1)}
                className={`${base} ${
                    currentPage === totalPages || totalPages === 0
                        ? "border-gray-300 text-gray-300 cursor-not-allowed"
                        : "border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                }`}
            >
                <ArrowRightIcon className="w-4 h-4" />
            </button>
        </nav>
    );
}
