import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";
import { deleteDoc, doc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";

const ProductDetail = () => {
    const context = useContext(myContext);
    const { loading, setLoading, getAllProduct, getAllProductFunction } = context;
    const navigate = useNavigate();

    const deleteProduct = async (id) => {
        setLoading(true)
        try {
            await deleteDoc(doc(fireDB, 'products', id))
            toast.success('Product Deleted successfully')
            await getAllProductFunction();
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <div>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-purple-300 font-bold">All Product</h1>
                <Link to={'/addproduct'}>
                    <button className="px-5 py-2 bg-purple-50 border border-purple-200 transition hover:border-purple-500 hover:text-gray-800 rounded-lg">
                        Add Product
                    </button>
                </Link>
            </div>

            {/* Loader */}
            <div className="flex justify-center relative top-20">
                {loading && <Loader />}
            </div>

            {/* Product Table */}
            <div className="w-full overflow-x-auto mb-5">
                <table className="w-full min-w-[768px] text-left border-collapse border border-purple-100 text-purple-400">
                    <thead>
                        <tr className="bg-purple-50 text-slate-800 font-bold text-[15px]">
                            <th className="px-4 py-3 border border-purple-100 text-center">S.No.</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Image</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Title</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Price</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Category</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Date</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Edit</th>
                            <th className="px-4 py-3 border border-purple-100 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllProduct.map((item, index) => {
                            const { id, title, price, category, date, productImageUrl } = item;
                            return (
                                <tr key={index} className="text-purple-500 bg-white min-h-[100px]">
                                    <td className="px-4 py-3 border border-purple-100">{index + 1}</td>
                                    <td className="px-4 py-3 border border-purple-100">
                                        <div className="flex justify-center">
                                            <img
                                                src={productImageUrl}
                                                alt="product"
                                                className="w-20 h-20 object-cover rounded-md"
                                            />
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 border border-purple-100 max-w-[150px] whitespace-nowrap truncate">
                                        {title}
                                    </td>
                                    <td className="px-4 py-3 border border-purple-100">₹{price}</td>
                                    <td className="px-4 py-3 border border-purple-100 max-w-[120px] whitespace-nowrap truncate capitalize">
                                        {category}
                                    </td>
                                    <td className="px-4 py-3 border border-purple-100 max-w-[140px] whitespace-nowrap truncate">
                                        {date}
                                    </td>
                                    <td
                                        onClick={() => navigate(`/updateproduct/${id}`)}
                                        className="px-4 py-3 border border-purple-100 text-green-500 hover:text-green-700 cursor-pointer"
                                    >
                                        Edit
                                    </td>
                                    <td
                                        onClick={() => deleteProduct(id)}
                                        className="px-4 py-3 border border-purple-100 text-red-500 hover:text-red-700 cursor-pointer"
                                    >
                                        Delete
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductDetail;
