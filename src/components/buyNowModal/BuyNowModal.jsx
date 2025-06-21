/* eslint-disable react/prop-types */
import {
  Button,
  Dialog,
  DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import toast from "react-hot-toast";

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await buyNowFunction();
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
      handleOpen();
    }
  };

  return (
    <>
      <Button
        type="button"
        onClick={handleOpen}
        className="w-full px-4 py-3 text-center text-gray-100 bg-purple-600 border border-transparent dark:border-gray-700 hover:border-purple-500 hover:text-purple-700 hover:bg-purple-100 rounded-xl"
      >
        Buy now
      </Button>

      <Dialog open={open} handler={handleOpen} className="bg-purple-50">
        <form onSubmit={handleSubmit}>
          <DialogBody>
            <div className="mb-3">
              <input
                type="text"
                name="name"
                value={addressInfo.name}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, name: e.target.value })
                }
                placeholder="Enter your name"
                className="bg-purple-50 border border-purple-200 px-2 py-2 w-full rounded-md outline-none text-purple-600 placeholder-purple-300"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="address"
                value={addressInfo.address}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, address: e.target.value })
                }
                placeholder="Enter your address"
                className="bg-purple-50 border border-purple-200 px-2 py-2 w-full rounded-md outline-none text-purple-600 placeholder-purple-300"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="number"
                name="pincode"
                value={addressInfo.pincode}
                onChange={(e) =>
                  setAddressInfo({ ...addressInfo, pincode: e.target.value })
                }
                placeholder="Enter your pincode"
                className="bg-purple-50 border border-purple-200 px-2 py-2 w-full rounded-md outline-none text-purple-600 placeholder-purple-300"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                name="mobileNumber"
                value={addressInfo.mobileNumber}
                onChange={(e) =>
                  setAddressInfo({
                    ...addressInfo,
                    mobileNumber: e.target.value,
                  })
                }
                placeholder="Enter your mobile number"
                className="bg-purple-50 border border-purple-200 px-2 py-2 w-full rounded-md outline-none text-purple-600 placeholder-purple-300"
                required
              />
            </div>

            <div>
              <Button
                type="submit"
                disabled={loading}
                className={`w-full px-4 py-3 text-center text-gray-100 border border-transparent rounded-xl transition ${
                  loading
                    ? "bg-purple-300 cursor-not-allowed"
                    : "bg-purple-600 hover:border-purple-500 hover:text-purple-700 hover:bg-purple-100"
                }`}
              >
                {loading ? "Placing Order..." : "Buy now"}
              </Button>
            </div>
          </DialogBody>
        </form>
      </Dialog>
    </>
  );
};

export default BuyNowModal;
