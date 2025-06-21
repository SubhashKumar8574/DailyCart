import { useContext, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import Loader from "../../components/loader/Loader";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { Eye, EyeOff } from "lucide-react";
import { setCart, clearCart } from "../../redux/cartSlice";
import { getCartFromFirestore } from "../../utils/cartSync";

const Login = () => {
    const context = useContext(myContext);
    const dispatch = useDispatch();
    const { loading, setLoading } = context;
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    const [userLogin, setUserLogin] = useState({
        email: "",
        password: ""
    });

    const userLoginFunction = async () => {
        if (userLogin.email === "" || userLogin.password === "") {
            return toast.error("All Fields are required");
        }

        setLoading(true);
        try {
            const users = await signInWithEmailAndPassword(auth, userLogin.email, userLogin.password);
            const userRef = users?.user?.uid;

            const q = query(collection(fireDB, "users"), where("uid", "==", userRef));
            const unsubscribe = onSnapshot(q, async (QuerySnapshot) => {
                let userData;
                QuerySnapshot.forEach((doc) => userData = doc.data());

                if (userData) {
                    localStorage.setItem("users", JSON.stringify(userData));
                    setUserLogin({ email: "", password: "" });

                    const cartItems = await getCartFromFirestore(userData.uid);
                    dispatch(setCart(cartItems));
                    localStorage.setItem(`cart_${userData.uid}`, JSON.stringify(cartItems));

                    toast.success("Login Successfully");
                    setLoading(false);

                    if (userData.role === "admin") {
                        navigate('/admin-dashboard');
                    } else {
                        navigate('/user-dashboard');
                    }
                } else {
                    toast.error("No user found!");
                    setLoading(false);
                }
            });

            return () => unsubscribe();
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error("Login Failed: " + error.message);
        }
    };

    useEffect(() => {
        auth.onAuthStateChanged(async user => {
            if (user) {
                const items = await getCartFromFirestore(user.uid);
                dispatch(setCart(items));
            } else {
                dispatch(clearCart());
            }
        });
    }, []);

    return (
        <div className="relative flex justify-center items-center min-h-screen bg-purple-50 px-4">

            {loading && <Loader />}
            <form
                onSubmit={(e) => {
                    e.preventDefault(); // prevents refresh
                    userLoginFunction();
                }}
                className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-purple-100"
            >
                <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">Login</h2>

                <div className="mb-4">
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={userLogin.email}
                        onChange={(e) => setUserLogin({ ...userLogin, email: e.target.value })}
                        className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none placeholder-purple-300"
                        required
                    />
                </div>

                <div className="mb-6 relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={userLogin.password}
                        onChange={(e) => setUserLogin({ ...userLogin, password: e.target.value })}
                        className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none placeholder-purple-300 pr-10"
                        required
                    />
                    <span
                        className="absolute right-3 top-2.5 text-purple-500 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </span>
                </div>

                {/* DO NOT use type="button" here — let it be submit */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full py-2 text-white font-bold rounded-md transition ${loading
                        ? "bg-purple-300 cursor-not-allowed"
                        : "bg-purple-500 hover:bg-purple-700"
                        }`}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                <p className="mt-4 text-center text-sm text-gray-700">
                    Don't have an account?
                    <Link
                        to="/signup"
                        className="text-purple-700 hover:text-purple-500 font-semibold ml-1"
                    >
                        Signup
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
