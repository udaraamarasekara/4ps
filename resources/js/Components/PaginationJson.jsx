import axios from "axios";


export default function PaginationJson({ links, setData=(data)=>{},typeFilter='',nameFilter='',brandFilter='',categoryFilter='',propertyFilter='',startDateFilter='',endDateFilter='' }) {
   async function handleClick(url) {
       const data = await axios.get(url,{ params: {
                type: typeFilter,
                name: nameFilter,
                brand: brandFilter,
                category: categoryFilter,
                property: propertyFilter,
                startDate: startDateFilter,
                endDate: endDateFilter,
            }})
       setData(data);
    }       
    return (
        <nav className="text-center mt-4">
            {links?.map((link) => {
                return (
                    link.url && <div
                        key={link.label}
                        onClick={() => handleClick(link.url)}
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
