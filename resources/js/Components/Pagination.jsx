import { Link } from "@inertiajs/react";

export default function Pagination({ links }) {
    return (
        <nav className="text-center mt-4">
            {links?.map((link) => {
                return (
                    link.url && <Link
                        preserveScroll
                        key={link.label}
                        href={link.url || ""}
                        className={
                            "inline-block py-2 px-3 rounded-lg border-1text-xs " +
                            (link.active ? "bg-gray-950 text-white" : " border-blue-500  text-blue-500 ") 
                        }
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </nav>
    );
}
