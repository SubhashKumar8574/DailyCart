import { Link, useNavigate } from "react-router-dom";
import SearchBar from "../searchBar/SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/cartSlice";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/FirebaseConfig";
import { useContext, useState } from "react";
import toast from "react-hot-toast";
import myContext from "../../context/myContext";
import Loader from "../loader/Loader";

// Safe JSON Parse
const safeJSONParse = (data) => {
    if (!data || data === 'undefined') return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
};

const Navbar = () => {
    const user = safeJSONParse(localStorage.getItem("users"));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, setLoading } = useContext(myContext);
    const [isLoggedOut, setIsLoggedOut] = useState(false);

    const logout = async () => {
    try {
        setIsLoggedOut(true);
        setLoading(true);

        const currentUid = auth.currentUser?.uid;
        if (currentUid) {
            localStorage.removeItem(`cart_${currentUid}`);
        }
        localStorage.removeItem("users");

        await signOut(auth);
        dispatch(clearCart());

        toast.success("You are successfully logged out!");

        // Wait for toast to show before navigating
        setTimeout(() => {
            setLoading(false);
            setIsLoggedOut(false);
            navigate("/");
        }, 1000); // 1 second delay

    } catch (error) {
        console.error("Logout Error:", error);
        toast.error("Logout failed!");
        setLoading(false);
        setIsLoggedOut(false);
    }
};


    // Format the user's name based on rules:
    // - If the name has 2 words and length ≤ 12 → show full name in uppercase
    // - If the name has ≥ 3 words or total length > 12 → show initials (first letter of each word)
    // - Also return a flag to indicate whether initials are used, for styling (e.g., round button)
    const formatUserName = (name = "") => {
        const words = name.trim().split(" ").filter(Boolean);
        const fullName = name.trim().toUpperCase();

        const isInitials = fullName.length > 12 || words.length >= 3;

        const displayName = isInitials
            ? words.map(word => word[0]?.toUpperCase()).join('')
            : fullName;

        return { displayName, isInitials };
    };

    const cartItems = useSelector((state) => state.cart);

    const navList = (
        <ul className="flex flex-nowrap items-center overflow-x-auto scrollbar-hide gap-x-2 text-white font-medium text-xs sm:text-sm md:text-base px-2">
            {/* Home */}
            <li className="hover:text-pink-400 transition">
                <Link to="/">Home</Link>
            </li>

            {/* All Product */}
            <li className="hover:text-pink-400 transition">
                <Link to="/allproduct">Product</Link>
            </li>

            {/* Cart */}
            <li className="hover:text-pink-400 transition">
                <Link to="/cart">Cart({cartItems.length})</Link>
            </li>

            {/* Signup */}
            {!user && (
                <li className="hover:text-pink-400 transition">
                    <Link to="/signup">SignUp</Link>
                </li>
            )}

            {/* Login */}
            {!user && (
                <li className="hover:text-pink-400 transition">
                    <Link to="/login">LogIn</Link>
                </li>
            )}

            {/* Logout */}
            {user && (
                <li className="hover:text-pink-400 transition whitespace-nowrap px-1 cursor-pointer">
                    {isLoggedOut ? (
                        <span className="text-gray-300">Logging out...</span>
                    ) : (
                        <span onClick={logout}>Logout</span>
                    )}
                </li>
            )}

            {/* User/Admin Dashboard */}
            {user?.role === "user" || user?.role === "admin" ? (() => {
                const { displayName, isInitials } = formatUserName(user?.name);
                const linkPath = user.role === "admin" ? "/admin-dashboard" : "/user-dashboard";

                return (
                    <li className={`flex items-center transition hover:text-gray-300 hover:border-gray-700 ${isInitials ? 'rounded-full px-3 py-1 bg-purple-500 text-white border' : 'bg-purple-500 border rounded-lg px-3 py-1'} whitespace-nowrap`}>
                        <Link
                            to={linkPath}
                            className="text-white text-sm sm:text-base font-semibold"
                        >
                            {displayName}
                        </Link>
                    </li>
                );
            })() : null}
        </ul>
    );

    return (
  <>
    {/* Fullscreen Loader */}
    {loading && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white bg-opacity-60 z-50">
        <Loader />
      </div>
    )}

    <nav className="bg-purple-800 sticky top-0 z-10">
      <div className="lg:flex lg:justify-between items-center py-3 lg:px-3">
        {/* Left */}
        <div className="left py-3 lg:py-0">
          <h2 className="font-bold text-white text-2xl text-center">
            <Link className="transition duration-200 hover:text-gray-300 hover:border-gray-700 hover:bg-purple-400 bg-purple-500 border rounded-lg px-3" to="/">
              DailyCart
            </Link>
            <span className="block text-sm font-normal text-yellow-600">All You Need, Delivered Daily</span>
          </h2>
        </div>

        {/* Search Bar */}
        <div className="w-full lg:w-auto mt-2 lg:mt-0 flex justify-center lg:justify-start">
          <SearchBar />
        </div>

        {/* Right Nav */}
        <div className="right flex justify-center mb-4 lg:mb-0">
          <div className="mt-4 lg:mt-0">
            {navList}
          </div>
        </div>
      </div>
    </nav>
  </>
);

};

export default Navbar;
