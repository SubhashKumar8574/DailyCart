import { useNavigate, useParams } from "react-router";
import myContext from "../../context/myContext";
import { useContext, useEffect, useState } from "react";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { fireDB } from "../../firebase/FirebaseConfig";
import toast from "react-hot-toast";
import Loader from "../../components/loader/Loader";

const categoryList = [
  { name: "fashion" },
  { name: "shirt" },
  { name: "jacket" },
  { name: "mobile" },
  { name: "laptop" },
  { name: "shoes" },
  { name: "home" },
  { name: "books" },
];

const UpdateProductPage = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllProductFunction } = context;

  const navigate = useNavigate();
  const { id } = useParams();

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
    }),
  });

  // Fetch existing product
  const getSingleProductFunction = async () => {
    setLoading(true);
    try {
      const productSnapshot = await getDoc(doc(fireDB, "products", id));
      const data = productSnapshot.data();
      setProduct({
        title: data?.title || "",
        price: data?.price || "",
        productImageUrl: data?.productImageUrl || "",
        category: data?.category || "",
        description: data?.description || "",
        quantity: data?.quantity || 1,
        time: data?.time || Timestamp.now(),
        date: data?.date || new Date().toLocaleString("en-US"),
      });
    } catch (error) {
      console.log(error);
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getSingleProductFunction();
  }, []);

  // Update product
  const updateProduct = async () => {
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
      const updatedProduct = {
        ...product,
        date: new Date().toLocaleString("en-US", {
          month: "short",
          day: "2-digit",
          year: "numeric",
        }),
      };

      await setDoc(doc(fireDB, "products", id), updatedProduct, { merge: true });

      toast.success("Product updated successfully");
      await getAllProductFunction();
      navigate("/admin-dashboard");
    } catch (error) {
      console.log(error);
      toast.error("Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  // Handle submit via enter key
  const handleSubmit = (e) => {
    e.preventDefault();
    updateProduct();
  };

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-purple-50 px-4">
      {loading && <Loader />}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white p-6 rounded-xl shadow-md border border-purple-100"
      >
        <h2 className="text-center text-2xl font-bold text-purple-600 mb-6">Update Product</h2>

        <div className="mb-3">
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={(e) => setProduct({ ...product, title: e.target.value })}
            placeholder="Product Title"
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={(e) => setProduct({ ...product, price: e.target.value })}
            placeholder="Product Price"
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300"
            required
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            name="productImageUrl"
            value={product.productImageUrl}
            onChange={(e) => setProduct({ ...product, productImageUrl: e.target.value })}
            placeholder="Product Image URL"
            className="w-full bg-purple-50 border border-purple-200 px-3 py-2 rounded-md outline-none text-purple-300 placeholder-purple-300"
            required
          />
        </div>

        <div className="mb-3 w-full">
          <div className="relative">
            <select
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
              className="w-full bg-purple-50 border border-purple-200 text-purple-400 placeholder-purple-300 px-3 py-2 rounded-md outline-none appearance-none"
              required
            >
              <option value="" disabled>
                Select Product Category
              </option>
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
            className={`w-full py-2 text-white font-bold rounded-md transition ${
              loading
                ? "bg-purple-300 cursor-not-allowed"
                : "bg-purple-500 hover:bg-purple-700"
            }`}
          >
            {loading ? "Updating Product..." : "Update Product"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProductPage;
