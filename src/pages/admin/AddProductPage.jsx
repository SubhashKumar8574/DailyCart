import { Timestamp, addDoc, collection } from "firebase/firestore";
import { useContext, useState } from "react";
import myContext from "../../context/myContext";
import toast from "react-hot-toast";
import { fireDB } from "../../firebase/FirebaseConfig";
import { useNavigate } from "react-router";
import Loader from "../../components/loader/Loader";

const categoryList = [
  { name: 'fashion' },
  { name: 'shirt' },
  { name: 'jacket' },
  { name: 'mobile' },
  { name: 'laptop' },
  { name: 'shoes' },
  { name: 'home' },
  { name: 'books' }
];

const AddProductPage = () => {
  const context = useContext(myContext);
  const { loading, setLoading } = context;
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    productImageUrl: "",
    category: "",
    description: "",
    quantity: 1,
    time: Timestamp.now(),
    date: new Date().toLocaleString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    })
  });

  const addProductFunction = async () => {
    if (
      !product.title ||
      !product.price ||
      !product.productImageUrl ||
      !product.category ||
      !product.description
    ) {
      toast.error("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const productRef = collection(fireDB, 'products');
      await addDoc(productRef, product);

      toast.success("Product added successfully");
      setProduct({         // optional: reset the form
        title: "",
        price: "",
        productImageUrl: "",
        category: "",
        description: "",
        quantity: 1,
        time: Timestamp.now(),
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        })
      });

      setLoading(false);
      navigate("/admin-dashboard");
    } catch (error) {
      console.error(error);
      toast.error("Add product failed");
      setLoading(false);
    }
  };



  return (
    <div className="relative flex justify-center items-center min-h-screen bg-purple-50 px-4">
      {loading && <Loader />}
      <form
        onSubmit={(e) => {
          e.preventDefault(); // prevents refresh
          addProductFunction();
        }}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-purple-100"
      >
        <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">Add Product</h2>

        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            placeholder='Product Title'
            className='w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300'
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder='Product Price'
            className='w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300'
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="productImageUrl"
            value={product.productImageUrl}
            onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
            placeholder='Product Image URL'
            className='w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300'
            required
          />
        </div>

        <div className="mb-3 w-full">
          <div className="relative">
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full bg-purple-50 border border-purple-200 text-purple-400 placeholder-purple-300 px-3 py-2 rounded-md outline-none text-sm sm:text-base appearance-none"
              required
            >
              <option value="" disabled>Select Product Category</option>
              {categoryList.map((cat, index) => (
                <option key={index} value={cat.name} className="capitalize text-purple-700">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-purple-400">
              ▼
            </div>
          </div>
        </div>

        <div className="mb-3">
          <textarea
            name="description"
            rows="5"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            placeholder="Product Description"
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 text-white font-bold rounded-md transition ${loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-700"
              }`}
          >
            {loading ? "Adding Product..." : "Add Product"}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
