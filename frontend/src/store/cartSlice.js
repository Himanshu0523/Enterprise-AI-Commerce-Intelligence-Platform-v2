import { createSlice } from "@reduxjs/toolkit";

const getInitialCart = () => {
  try {
    const item = localStorage.getItem("cart");
    return item ? JSON.parse(item) : [];
  } catch (error) {
    console.error("Failed to parse cart from localStorage", error);
    return [];
  }
};

const initialState = {
  items: getInitialCart(),
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;

      const existing = state.items.find((i) => i._id === item._id);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({ ...item, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.items));
    },

    setCart: (state, action) => {
      state.items = action.payload;
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
    },

    increaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },
  },
});

export const { addToCart, setCart, removeFromCart, increaseQty, decreaseQty } =
  cartSlice.actions;

export default cartSlice.reducer;
