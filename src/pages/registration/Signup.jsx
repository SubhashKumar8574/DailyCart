import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { auth, fireDB } from "../../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import Loader from "../../components/loader/Loader";
import { Eye, EyeOff } from "lucide-react";

const Signup = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [userSignup, setUserSignup] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const deleteUserFromAuth = async (user) => {
    try {
      await deleteUser(user);
      console.log("User deleted from Firebase Authentication.");
    } catch (error) {
      console.error("Error deleting user from Firebase Authentication:", error);
    }
  };

  const userSignupFunction = async () => {
    if (!userSignup.name || !userSignup.email || !userSignup.password) {
      return toast.error("All Fields are required");
    }
    if (userSignup.password.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    setLoading(true);
    try {
      const users = await createUserWithEmailAndPassword(
        auth,
        userSignup.email,
        userSignup.password
      );

      const user = {
        name: userSignup.name,
        email: users.user.email,
        uid: users.user.uid,
        role: userSignup.role,
        time: Timestamp.now(),
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      try {
        await addDoc(collection(fireDB, "users"), user);
      } catch (firestoreError) {
        await deleteUserFromAuth(users.user);
        toast.error("Failed to add user to Firestore, account rolled back.");
        setLoading(false);
        return;
      }

      setUserSignup({ name: "", email: "", password: "", role: "user" });
      toast.success("Signup Successfully");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      console.log(error);
      setLoading(false);
      if (error.code === "auth/email-already-in-use") {
        toast.error("Email already in use. Please log in.");
      } else {
        toast.error("Signup Failed: " + error.message);
      }
    }
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-purple-50 px-4">
      {loading && <Loader />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          userSignupFunction();
        }}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-purple-100"
      >
        <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">
          Signup
        </h2>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Full Name"
            value={userSignup.name}
            onChange={(e) =>
              setUserSignup({ ...userSignup, name: e.target.value })
            }
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none placeholder-purple-300"
            required
          />
        </div>

        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            value={userSignup.email}
            onChange={(e) =>
              setUserSignup({ ...userSignup, email: e.target.value })
            }
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none placeholder-purple-300"
            required
          />
        </div>

        <div className="mb-6 relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={userSignup.password}
            onChange={(e) =>
              setUserSignup({ ...userSignup, password: e.target.value })
            }
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

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white font-bold rounded-md transition ${loading
            ? "bg-purple-300 cursor-not-allowed"
            : "bg-purple-500 hover:bg-purple-700"
            }`}
        >
          {loading ? "Signing Up..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-700">
          Have an account?
          <Link
            to="/login"
            className="text-purple-700 hover:text-purple-500 font-semibold ml-1"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
