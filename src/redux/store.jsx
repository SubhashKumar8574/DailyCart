import { configureStore } from '@reduxjs/toolkit'; 
import cartReducer from './cartSlice'; 

export const store = configureStore({
  reducer: {
    cart: cartReducer, // Fix: Use `cartReducer` instead of `{cartSlice}`
  },
});
