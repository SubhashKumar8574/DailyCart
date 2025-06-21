// Import statements remain the same
import { useDispatch, useSelector } from "react-redux";
import Layout from "../../components/layout/Layout";
import { Trash } from "lucide-react";
import { decrementQuantity, deleteFromCart, incrementQuantity, setCart, } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { Timestamp, addDoc, collection, } from "firebase/firestore";
import { fireDB, auth } from "../../firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import { Navigate } from "react-router-dom";
import { deleteItemFromFirestore, getCartFromFirestore, updateCartItemQuantityInFirestore } from "../../utils/cartSync";

//  Get user from localStorage
function getUserFromLocalStorage() {
    const userData = localStorage.getItem("users");
    if (userData) {
        try {
            return JSON.parse(userData);
        } catch (error) {
            console.error("Error parsing user data:", error);
            return null;
        }
    }
    return null;
}

const CartPage = () => {
    const user = getUserFromLocalStorage();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // Changed this to a state variable instead of directly using auth.currentUser
    const [uid, setUid] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    // Listen for auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUid(user.uid);
            } else {
                setUid(null);
            }
            setAuthChecked(true);
        });

        // Clean up the listener
        return () => unsubscribe();
    }, []);

    //  Sync Redux cart -> localStorage  && Fetch Data from FireStore.
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFirestoreCart = async () => {
            if (!uid) return;
            try {
                setLoading(true);
                const firestoreCart = await getCartFromFirestore(uid);
                localStorage.setItem(`cart_${uid}`, JSON.stringify(firestoreCart));
                dispatch(setCart(firestoreCart)); // update Redux state      
            } catch (error) {
                console.error("Error fetching Firestore cart:", error);
            } finally {
                setLoading(false); // loading ends here
            }
        };

        // Only fetch cart data if we have a uid
        if (uid) {
            fetchFirestoreCart();
        }
    }, [uid, dispatch]);

    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        }),
    });
  
    const deleteCart = (item) => {
        if (!uid) {
            toast.error("Please wait, authentication in progress...");
            return;
        }
        dispatch(deleteFromCart(item.id));
        deleteItemFromFirestore(uid, item.id);
        toast.success("Removed from cart");
    };

    const incrementThrottle = useRef(false);
    const decrementThrottle = useRef(false);
    const throttleDelay = 10; // Adjust the delay as needed

    const handleIncrement = async (id) => {
        if (!uid) return;
        if (incrementThrottle.current) {
            toast("Please wait, updating quantity...", { type: 'warning', duration: 500 }); // Use toast() with type
            return;
        }
        incrementThrottle.current = true;
        dispatch(incrementQuantity(id));
        console.log("UID:", uid, "ItemID:", id, "Action: increment (throttled)");
        await updateCartItemQuantityInFirestore(uid, id, "increment");
        setTimeout(() => {
            incrementThrottle.current = false;
        }, throttleDelay);
    };

    const handleDecrement = async (id) => {
        if (!uid) return;
        if (decrementThrottle.current) {
            toast("Please wait, updating quantity...", { type: 'warning', duration: 500 }); // Use toast() with type
            return;
        }
        decrementThrottle.current = true;
        dispatch(decrementQuantity(id));
        console.log("UID:", uid, "ItemID:", id, "Action: decrement (throttled)");
        await updateCartItemQuantityInFirestore(uid, id, "decrement");
        setTimeout(() => {
            decrementThrottle.current = false;
        }, throttleDelay);
    };


    const cartItemTotal = cartItems.reduce((total, item) => total + item.quantity, 0);
    const cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    const buyNowFunction = async () => {
        if (!uid) {
            toast.error("Please wait, authentication in progress...");
            return;
        }

        if (!addressInfo.name || !addressInfo.address || !addressInfo.pincode || !addressInfo.mobileNumber) {
            return toast.error("All fields are required");
        }

        const orderInfo = {
            cartItems,
            addressInfo,
            email: user.email,
            userid: uid,
            status: "confirmed",
            time: Timestamp.now(),
            date: new Date().toLocaleString("en-US", {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }),
        };

        try {
            await addDoc(collection(fireDB, "order"), orderInfo);
            setAddressInfo({
                name: "",
                address: "",
                pincode: "",
                mobileNumber: "",
            });
            toast.success("Order placed successfully!");
        } catch (error) {
            console.error(error);
            toast.error("Order failed");
        }
    };

     // Check if auth has been checked before redirecting
     if (authChecked && !user) return <Navigate to="/login" replace />;

    // Show loading state while authentication is being checked
    if (!authChecked) {
        return (
            <Layout>
                <div className="container mx-auto max-w-7xl px-2 lg:px-0">
                    <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>
                        <div className="flex justify-center items-center h-40">
                            <p className="text-gray-500">Verifying authentication...</p>
                        </div>
                    </div>
                </div>
            </Layout>
        );
    }

    // Rest of the component remains the same...
    return (
        <Layout>
            <div className="container mx-auto max-w-7xl px-2 lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Shopping Cart</h1>

                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">

                        {/* Cart Items Section */}
                        <section className="rounded-lg bg-white lg:col-span-8">
                            <ul className="divide-y divide-gray-200">
                                {cartItems && cartItems.length > 0 ? (
                                    cartItems.map((item, index) => {
                                        const { id, title, price, productImageUrl, quantity, category } = item;
                                        return (
                                            <li key={index} className="py-6">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        {loading ? (
                                                            <div className="h-24 w-24 bg-gray-300 animate-pulse rounded-md" />
                                                        ) : (
                                                            <img
                                                                src={productImageUrl}
                                                                alt="Product"
                                                                className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                                            />
                                                        )}
                                                    </div>

                                                    <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                        <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                            <div>
                                                                <div className="flex justify-between">
                                                                    <h3 className="text-sm font-semibold text-black">
                                                                        {loading ? (
                                                                            <div className="w-24 h-4 bg-gray-200 rounded animate-pulse" />
                                                                        ) : (
                                                                            title
                                                                        )}
                                                                    </h3>
                                                                </div>
                                                                <div className="mt-1 flex text-sm text-gray-500">
                                                                    {loading ? (
                                                                        <div className="w-16 h-3 bg-gray-100 rounded animate-pulse" />
                                                                    ) : (
                                                                        category
                                                                    )}
                                                                </div>
                                                                <div className="mt-1 flex items-end">
                                                                    <p className="text-sm font-medium text-gray-900">
                                                                        {loading ? (
                                                                            <span className="w-12 h-4 bg-gray-100 rounded animate-pulse" />
                                                                        ) : (
                                                                            `₹ ${price}`
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Quantity and Remove */}
                                                        {!loading && (
                                                            <div className="mt-2 flex">
                                                                <div className="min-w-24 flex">
                                                                    <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7">-</button>
                                                                    <input
                                                                        type="text"
                                                                        readOnly
                                                                        className="mx-1 h-7 w-9 rounded-md border text-center"
                                                                        value={quantity}
                                                                    />
                                                                    <button onClick={() => handleIncrement(id)} type="button" className="h-7 w-7">+</button>
                                                                </div>
                                                                <div className="ml-6 flex text-sm">
                                                                    <button
                                                                        onClick={() => deleteCart(item)}
                                                                        type="button"
                                                                        className="flex items-center space-x-1 px-2 py-1 pl-0"
                                                                    >
                                                                        <Trash size={12} className="text-red-500" />
                                                                        <span className="text-xs font-medium text-red-500">Remove</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        );
                                    })
                                ) : (
                                    <li className="text-center text-gray-500 p-4">
                                        {loading ? "Fetching cart items..." : "No items in cart"}
                                    </li>
                                )}
                            </ul>
                        </section>

                        {/* Price Details Section */}
                        <section className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0">
                            <h2 className="border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4">Price Details</h2>
                            <div>
                                <dl className="space-y-1 px-2 py-4">
                                    <div className="flex justify-between">
                                        <dt className="text-sm text-gray-800">
                                            Price ({cartItemTotal} {cartItemTotal === 1 ? "item" : "items"})
                                        </dt>

                                        <dd className="text-sm font-medium text-gray-900">₹ {cartTotal}</dd>
                                    </div>
                                    <div className="flex justify-between py-4">
                                        <dt className="text-sm text-gray-800">Delivery Charges</dt>
                                        <dd className="text-sm font-medium text-green-700">Free</dd>
                                    </div>
                                    <div className="flex justify-between border-y border-dashed py-4">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">₹ {cartTotal}</dd>
                                    </div>
                                </dl>

                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        <BuyNowModal
                                            addressInfo={addressInfo}
                                            setAddressInfo={setAddressInfo}
                                            buyNowFunction={buyNowFunction}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default CartPage;