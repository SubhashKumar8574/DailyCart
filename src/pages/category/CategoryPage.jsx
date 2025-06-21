import { useParams, useNavigate } from "react-router";
import Layout from "../../components/layout/Layout";
import { useContext, useEffect, useState } from "react";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  addToCart,
  deleteFromCart,
  clearCart,
} from "../../redux/cartSlice";
import {
  getCartFromFirestore,
  syncCartToFirestore,
  deleteItemFromFirestore,
} from "../../utils/cartSync";
import { auth } from "../../firebase/FirebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

const CategoryPage = () => {
  const { categoryname } = useParams();
  const context = useContext(myContext);
  const { getAllProduct, loading } = context;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const uid = auth.currentUser?.uid;

  const [firestoreCartIds, setFirestoreCartIds] = useState([]);
  const filterProduct = getAllProduct.filter((obj) =>
    obj.category.includes(categoryname)
  );

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
    deleteItemFromFirestore(uid, item.id);
    toast.success("Deleted from cart");
    setFirestoreCartIds((prev) => prev.filter((id) => id !== item.id));
  };

  return (
    <Layout>
      <div className="mt-10">
        <h1 className="text-center mb-5 text-2xl font-semibold first-letter:uppercase">
          {categoryname}
        </h1>

        {loading ? (
          <div className="flex justify-center">
            <Loader />
          </div>
        ) : (
          <section className="text-gray-600 body-font">
            <div className="container px-5 py-5 mx-auto">
              {filterProduct.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filterProduct.map((item, index) => {
                    const { id, title, price, productImageUrl } = item;
                    const inFirestoreCart = firestoreCartIds.includes(id);

                    return (
                      <div key={index}>
                        <div className="group h-full border border-gray-300 rounded-xl overflow-hidden shadow-[inset_0_0_2px_rgba(0,0,0,0.6)] hover:shadow-[0_8px_30px_rgba(168,85,247,0.6)] transition duration-300 bg-white">
                          <div
                            onClick={() => navigate(`/productinfo/${id}`)}
                            className="overflow-hidden flex justify-center items-center bg-gray-100 cursor-pointer"
                          >
                            <img
                              src={productImageUrl}
                              alt={title}
                              className="w-full h-60 sm:h-64 md:h-72 lg:h-80 object-contain transition-transform duration-300 group-hover:scale-105"
                            />
                          </div>

                          <div className="p-4 sm:p-5">
                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                              DailyMart
                            </h2>
                            <h1 className="title-font text-base sm:text-lg font-medium text-gray-900 mb-2">
                              {title.substring(0, 25)}
                            </h1>
                            <h1 className="title-font text-base sm:text-lg font-medium text-gray-900 mb-4">
                              ₹{price}
                            </h1>

                            <div className="flex justify-center">
                              {inFirestoreCart ? (
                                <button
                                  onClick={() => deleteCart(item)}
                                  className="bg-red-600 hover:bg-red-400 transition w-full text-white py-[6px] rounded-lg font-bold"
                                >
                                  Delete From Cart
                                </button>
                              ) : (
                                <button
                                  onClick={() => addCart(item)}
                                  className="bg-purple-700 hover:bg-purple-500 transition w-full text-white py-[6px] rounded-lg font-bold"
                                >
                                  Add To Cart
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center mt-10">
                  <img
                    className="mb-4 w-24"
                    src="https://cdn-icons-png.flaticon.com/128/2748/2748614.png"
                    alt="Not Found"
                  />
                  <h1 className="text-black text-xl font-medium">
                    No {categoryname} product found
                  </h1>
                </div>
              )}
            </div>
          </section>
        )}
      </div>
    </Layout>
  );
};

export default CategoryPage;
