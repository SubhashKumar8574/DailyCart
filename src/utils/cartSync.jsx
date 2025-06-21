import { fireDB } from '../firebase/FirebaseConfig';
import { doc, setDoc, getDoc, runTransaction } from 'firebase/firestore';

// Sync entire cart to Firestore (merge = true to preserve other fields)
export const syncCartToFirestore = async (uid, cartItems) => {
  try {
    const cartRef = doc(fireDB, 'carts', uid);
    await setDoc(cartRef, { items: cartItems }, { merge: true });
    console.log("Cart synced to Firestore From CartSync");
  } catch (error) {
    console.error("Error syncing cart to Firestore:", error);
  }
};

// Get cart from Firestore
export const getCartFromFirestore = async (uid) => {
  try {
    const cartRef = doc(fireDB, 'carts', uid);
    const docSnap = await getDoc(cartRef);
    return docSnap.exists() ? docSnap.data().items : [];
  } catch (error) {
    console.error("Error fetching cart from Firestore:", error);
    return [];
  }
};

// Delete a specific item
export const deleteItemFromFirestore = async (uid, itemId) => {
  try {
    const cartRef = doc(fireDB, 'carts', uid);
    const docSnap = await getDoc(cartRef);

    if (!docSnap.exists()) return;

    const updatedItems = docSnap.data().items.filter(item => item.id !== itemId);
    await setDoc(cartRef, { items: updatedItems });
  } catch (error) {
    console.error("Error deleting item from Firestore:", error);
  }
};

// Increment & Decrement the quantity of items
export const updateCartItemQuantityInFirestore = async (uid, itemId, action) => {
  if (!uid || !itemId || (action !== 'increment' && action !== 'decrement')) {
    console.error("Missing UID, itemId, or invalid action");
    return;
  }
  const cartRef = doc(fireDB, 'carts', uid);
  try {
    await runTransaction(fireDB, async (transaction) => {
      const cartSnap = await transaction.get(cartRef);

      if (!cartSnap.exists()) {
        console.log("Transaction: Cart not found for UID:", uid);
        return;
      }

      const existingItems = cartSnap.data().items || [];
      const itemToUpdate = existingItems.find(item => item.id === itemId);

      if (!itemToUpdate) {
        console.log("Transaction: Item with ID", itemId, "not found in cart.");
        return;
      }

      let newQuantity = itemToUpdate.quantity;
      if (action === 'increment') {
        newQuantity += 1;
      } else if (action === 'decrement') {
        newQuantity = Math.max(1, newQuantity - 1);
      }

      const updatedItems = existingItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );

      transaction.update(cartRef, { items: updatedItems });
      console.log(`Transaction: Quantity ${action}ed for item ID ${itemId} in Firestore.`);
    });
    console.log("Transaction committed successfully.");
  } catch (error) {
    console.error("Error updating item quantity in Firestore transaction:", error);
  }
};

// Clear the entire cart
export const clearCartInFirestore = async (uid) => {
  try {
    const cartRef = doc(fireDB, 'carts', uid);
    await setDoc(cartRef, { items: [] }, { merge: true });
  } catch (error) {
    console.error("Error clearing Firestore cart:", error);
  }
};
