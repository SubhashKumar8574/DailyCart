import { useContext, useEffect } from "react";
import myContext from "../../context/myContext";

const OrderDetail = () => {
    const context = useContext(myContext);
    const { getAllOrder, deleteProduct, fetchAllOrders } = context;

    useEffect(() => {
        if (typeof getAllOrder === "function") {
            getAllOrder();
        } else if (typeof fetchAllOrders === "function") {
            fetchAllOrders();
        }
    }, []);

    const handleDeleteItem = (orderId, productId) => {
        if (window.confirm("Are you sure you want to delete this item?")) {
            deleteProduct(orderId, productId);
        }
    };

    const handleDeleteOrder = (orderId) => {
        if (window.confirm("Are you sure you want to delete this order?")) {
            deleteProduct(orderId);
        }
    };

    const cellClass = "px-4 py-3 border border-purple-200 text-center align-middle min-h-[60px] text-[15px]";

    return (
        <div>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-purple-300 font-bold">All Orders</h1>
            </div>

            <div className="w-full overflow-x-auto mb-10">
                <div className="min-w-[1200px]">
                    <table className="w-full text-sm text-purple-400 border border-collapse sm:border-separate border-purple-100 text-center">
                        <thead>
                            <tr className="bg-purple-50 text-slate-800 font-bold text-[15px]">
                                {[
                                    "S.No.", "User ID", "Order ID", "Product IDs", "Images", "Titles",
                                    "Categories", "Prices", "Quantities", "Totals", "Remove Item",
                                    "Status", "Name", "Address", "Pincode", "Phone", "Email", "Date", "Delete Order"
                                ].map((heading, i) => (
                                    <th key={i} className="px-4 py-4 border border-purple-300 text-center">
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(getAllOrder) &&
                                getAllOrder.map((order, index) => {
                                    const {
                                        id: orderId,
                                        userid,
                                        cartItems,
                                        status,
                                        email,
                                        date,
                                        addressInfo,
                                    } = order;

                                    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

                                    return (
                                        <tr key={orderId} className="text-purple-500 bg-white border-t border-purple-200 align-top text-center">
                                            <td className={cellClass}>{index + 1}</td>
                                            <td className={`${cellClass} break-words`}>{userid}</td>
                                            <td className={`${cellClass} break-words`}>{orderId}</td>

                                            {/* Product IDs */}
                                            <td className={cellClass}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600 last:border-none">
                                                        {item.id}
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Images */}
                                            <td className={cellClass}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600 last:border-none flex justify-center">
                                                        <img
                                                            src={item.productImageUrl}
                                                            alt="product"
                                                            className="w-14 h-14 object-cover rounded"
                                                        />
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Titles */}
                                            <td className={`${cellClass} max-w-[180px]`}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600 last:border-none truncate">
                                                        {item.title}
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Categories */}
                                            <td className={`${cellClass} capitalize`}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600 last:border-none">
                                                        {item.category}
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Prices */}
                                            <td className={cellClass}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600 last:border-none">
                                                        ₹{item.price}
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Quantities */}
                                            <td className={cellClass}>
                                                {cartItems.map((item, i) => (
                                                    <div key={i} className="py-1 border-b-2 border-purple-600  last:border-none">
                                                        {item.quantity}
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Totals */}
                                            <td className={`${cellClass} font-semibold text-slate-700`}>
                                                ₹{totalAmount}
                                            </td>

                                            {/* Remove Item */}
                                            <td className={`${cellClass} text-red-500`}>
                                                {cartItems.map((item, i) => (
                                                    <div
                                                        key={i}
                                                        onClick={() => handleDeleteItem(orderId, item.id)}
                                                        className="py-1 border-b-2 border-purple-600 last:border-none cursor-pointer hover:text-red-900"
                                                    >
                                                        Remove
                                                    </div>
                                                ))}
                                            </td>

                                            {/* Order Info */}
                                            <td className={`${cellClass} ${status === "confirmed" ? "text-green-500 font-semibold" : "text-slate-500"}`}>{status}</td>
                                            <td className={cellClass}>{addressInfo?.name}</td>
                                            <td className={`${cellClass} break-words max-w-[200px]`}>{addressInfo?.address}</td>
                                            <td className={cellClass}>{addressInfo?.pincode}</td>
                                            <td className={cellClass}>{addressInfo?.mobileNumber}</td>
                                            <td className={`${cellClass} break-words`}>{email}</td>
                                            <td className={cellClass}>{date}</td>

                                            {/* Delete Order */}
                                            <td
                                                className={`${cellClass} text-red-500 hover:text-red-900 cursor-pointer`}
                                                onClick={() => handleDeleteOrder(orderId)}
                                            >
                                                Delete Order
                                            </td>
                                        </tr>
                                    );
                                })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
