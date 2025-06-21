import { createSlice } from '@reduxjs/toolkit';

// Get the current user from localStorage
const user = JSON.parse(localStorage.getItem('users'));

// Load cart specific to the logged-in user
const initialState = user ? (JSON.parse(localStorage.getItem(`cart_${user.uid}`)) ?? []) : [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const itemIndex = state.findIndex(item => item.id === action.payload.id);
            if (itemIndex === -1) {
                const sanitizedPayload = {
                    ...action.payload,
                    time: Date.now(), // Replace Firebase Timestamp with a number
                    quantity: 1,
                };
                state.push(sanitizedPayload);
            } else {
                state[itemIndex].quantity += 1;    // Already in cart, just increment
            }

            // Update cart in localStorage
            const user = JSON.parse(localStorage.getItem('users'));
            if (user) {
                localStorage.setItem(`cart_${user.uid}`, JSON.stringify(state));
            }
        },
        deleteFromCart(state, action) {
            const updatedCart = state.filter(item => item.id !== action.payload);

            // Update localStorage
            const user = JSON.parse(localStorage.getItem('users'));
            if (user) {
                localStorage.setItem(`cart_${user.uid}`, JSON.stringify(updatedCart));
            }

            return updatedCart;
        },
        incrementQuantity(state, action) {
            const item = state.find(item => item.id === action.payload);
            if (item) {
                item.quantity += 1;
            }

            const user = JSON.parse(localStorage.getItem('users'));
            if (user) {
                localStorage.setItem(`cart_${user.uid}`, JSON.stringify(state));
            }
        },
        decrementQuantity(state, action) {
            const item = state.find(item => item.id === action.payload);
            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }

            const user = JSON.parse(localStorage.getItem('users'));
            if (user) {
                localStorage.setItem(`cart_${user.uid}`, JSON.stringify(state));
            }
        },
        clearCart() {
            return [];
        },
        setCart(state, action) {
            const user = JSON.parse(localStorage.getItem('users'));
            if (user) {
                localStorage.setItem(`cart_${user.uid}`, JSON.stringify(action.payload));
            }
            return action.payload;
        },
        updateQuantity: (state, action) => {
            const { id, quantity } = action.payload;
            const item = state.find(i => i.id === id);
            if (item) item.quantity = quantity;
        },

    },
});

export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity, clearCart, setCart, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
