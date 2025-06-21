import { useEffect, useState } from 'react';
import MyContext from './myContext';
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, getDoc, updateDoc } from 'firebase/firestore';
import { fireDB } from '../firebase/FirebaseConfig';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { syncCartToFirestore } from '../utils/cartSync';

function MyState({ children }) {
    const [loading, setLoading] = useState(false);

    // Products
    const [getAllProduct, setGetAllProduct] = useState([]);

    const getAllProductFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "products"), orderBy('time'));
            const data = onSnapshot(q, (QuerySnapshot) => {
                let productArray = [];
                QuerySnapshot.forEach((doc) => {
                    productArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllProduct(productArray);
                setLoading(false);
            });
            return () => data();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // Orders
    const [getAllOrder, setGetAllOrder] = useState([]);

    const getAllOrderFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "order"), orderBy('time'));
            const data = onSnapshot(q, (QuerySnapshot) => {
                let orderArray = [];
                QuerySnapshot.forEach((doc) => {
                    orderArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllOrder(orderArray);
                setLoading(false);
            });
            return () => data();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const deleteProduct = async (orderId, itemId = null) => {
        setLoading(true);
        try {
            if (itemId) {
                const orderRef = doc(fireDB, 'order', orderId);
                const orderDoc = await getDoc(orderRef);

                if (orderDoc.exists()) {
                    const orderData = orderDoc.data();
                    const updatedItems = orderData.cartItems.filter(item => item.id !== itemId);
                    await updateDoc(orderRef, { cartItems: updatedItems });
                    toast.success('Item Deleted Successfully');
                } else {
                    toast.error('Order not found!');
                }
            } else {
                await deleteDoc(doc(fireDB, 'order', orderId));
                toast.success('Order Deleted Successfully');
            }
            setLoading(false);
        } catch (error) {
            console.error('Error deleting order/item: ', error);
            toast.error('Failed to delete');
            setLoading(false);
        }
    };

    // Users
    const [getAllUser, setGetAllUser] = useState([]);

    const getAllUserFunction = async () => {
        setLoading(true);
        try {
            const q = query(collection(fireDB, "users"), orderBy('time'));
            const data = onSnapshot(q, (QuerySnapshot) => {
                let userArray = [];
                QuerySnapshot.forEach((doc) => {
                    userArray.push({ ...doc.data(), id: doc.id });
                });
                setGetAllUser(userArray);
                setLoading(false);
            });
            return () => data();
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    // 🛒 Sync Redux cart to Firestore when it changes
    const cartItems = useSelector(state => state.cart);
    const user = JSON.parse(localStorage.getItem('users'));

    useEffect(() => {
        if (user && cartItems.length >= 0) {       
            syncCartToFirestore(user.uid, cartItems);           
        }
    }, []);

    useEffect(() => {
        getAllProductFunction();
        getAllOrderFunction();
        getAllUserFunction();
    }, []);

    return (
        <MyContext.Provider value={{
            loading,
            setLoading,
            getAllProduct,
            getAllProductFunction,
            getAllOrder,
            deleteProduct,
            getAllUser
        }}>
            {children}
        </MyContext.Provider>
    );
}

export default MyState;
