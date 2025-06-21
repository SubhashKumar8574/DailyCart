import { useContext, useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { useParams } from "react-router";
import { fireDB } from "../../firebase/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, deleteFromCart, clearCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";
import { auth } from "../../firebase/FirebaseConfig";
import {
    syncCartToFirestore,
    deleteItemFromFirestore,
    getCartFromFirestore,
} from "../../utils/cartSync";
import { onAuthStateChanged } from "firebase/auth";

const ProductInfo = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;
    const [product, setProduct] = useState('');
    const { id } = useParams();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);
    const [firestoreCartIds, setFirestoreCartIds] = useState([]);

    // Get product data
    const getProductData = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            setProduct({ ...productTemp.data(), id: productTemp.id });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                dispatch(clearCart());
                setFirestoreCartIds([]);
            }
        });

        return () => unsubscribe();
    }, [dispatch]);

    useEffect(() => {
        const fetchFirestoreCart = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setFirestoreCartIds([]);
                return;
            }

            try {
                const firestoreCart = await getCartFromFirestore(currentUser.uid);
                const ids = firestoreCart.map((item) => item.id);
                setFirestoreCartIds(ids);
            } catch (error) {
                console.error("Error fetching cart:", error);
                setFirestoreCartIds([]);
            }
        };

        fetchFirestoreCart();
    }, [auth.currentUser?.uid]);

    const addCart = (item) => {
        const currentUser = auth.currentUser;
        if (!currentUser) {
            toast.error("Please login to add items to cart");
            return;
        }

        dispatch(addToCart({ ...item, time: Date.now() }));
        syncCartToFirestore(currentUser.uid, [
            ...cartItems,
            { ...item, time: Date.now() },
        ]);
        toast.success("Added to cart");
        setFirestoreCartIds((prev) => [...prev, item.id]);
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item.id));
        deleteItemFromFirestore(auth.currentUser?.uid, item.id);
        toast.success("Deleted from cart");
        setFirestoreCartIds((prev) => prev.filter((id) => id !== item.id));
    };

    useEffect(() => {
        getProductData();
    }, [id]);

    return (
        <Layout>
            <section className="py-6 sm:py-10 lg:py-16 font-poppins dark:bg-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="max-w-6xl px-4 mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            {/* Image Section */}
                            <div className="w-full md:w-1/2">
                                <div className="overflow-hidden rounded-xl bg-white hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] transition duration-300">
                                    <img
                                        src={product?.productImageUrl}
                                        alt={product?.title}
                                        className="w-full h-64 sm:h-72 md:h-96 lg:h-[32em] object-contain p-4 transition-transform duration-300 hover:scale-105 cursor-pointer"
                                    />
                                </div>
                            </div>


                            {/* Info Section */}
                            <div className="w-full md:w-1/2">
                                <div className="lg:pl-12">
                                    <div className="mb-6">
                                        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-300 mb-4">
                                            {product?.title}
                                        </h2>
                                        <p className="text-lg font-bold text-purple-700 mb-2">
                                            ₹{product?.price}
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-400 mb-2">
                                            Description :
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {product?.description}
                                        </p>
                                    </div>

                                    <div className="mt-8">
                                        {firestoreCartIds.includes(product?.id) ? (
                                            <button
                                                onClick={() => deleteCart(product)}
                                                className="w-full px-6 py-3 bg-red-600 hover:bg-red-400 text-white font-semibold rounded-lg transition"
                                            >
                                                Delete From Cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => addCart(product)}
                                                className="w-full px-6 py-3 bg-purple-700 hover:bg-purple-500 text-white font-semibold rounded-lg transition"
                                            >
                                                Add To Cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default ProductInfo;
