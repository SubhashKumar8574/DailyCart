import { useContext, useState, useEffect } from "react";
import myContext from "../../context/myContext";
import { useNavigate } from "react-router";

const SearchBar = () => {
    const context = useContext(myContext);
    const { getAllProduct } = context;
    const [search, setSearch] = useState("");
    const [filteredResults, setFilteredResults] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!search) {
            setFilteredResults([]);
            return;
        }

        const lowerSearch = search.toLowerCase();

        const combinedMatchProducts = getAllProduct.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(lowerSearch);
            const categoryMatch = Array.isArray(item.category)
                ? item.category.some(cat => cat.toLowerCase().includes(lowerSearch))
                : typeof item.category === 'string' && item.category.toLowerCase().includes(lowerSearch);

            return titleMatch || categoryMatch;
        });

        setFilteredResults(combinedMatchProducts.slice(0, 8));
    }, [search, getAllProduct]);

    return (
        <div className="relative w-full">
            {/* Search input */}
            <div className="flex justify-center px-4 py-2">
                <input
                    type="text"
                    placeholder="Search here"
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-gray-200 placeholder-gray-400 rounded-lg px-2 py-2 w-11/12 sm:w-96 md:w-96 lg:w-96 outline-none text-black"
                />
            </div>

            {/* Search dropdown */}
            <div className="flex justify-center">
                {search && (
                    <div className="absolute bg-gray-200 w-11/12 sm:w-96 md:w-96 lg:w-96 z-50 mt-1 rounded-lg px-2 py-2">
                        {filteredResults.length > 0 ? (
                            filteredResults.map((item, index) => (
                                <div
                                    key={index}
                                    className="py-2 px-2 cursor-pointer hover:bg-gray-300 rounded"
                                    onClick={() => navigate(`/productinfo/${item.id}`)}
                                >
                                    <div className="flex items-center gap-2">
                                        <img className="w-10" src={item.productImageUrl} alt={item.title} />
                                        {item.title}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex justify-center">
                                <img
                                    className="w-20"
                                    src="https://cdn-icons-png.flaticon.com/128/10437/10437090.png"
                                    alt="No products found"
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
