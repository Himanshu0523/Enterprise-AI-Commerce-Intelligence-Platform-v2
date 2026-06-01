// import { useCart } from "../context/CartContext";

import { createContext , useState } from "react";

const CartContext = createContext();

export const CartProvider = ({children}) => {
    const [cart , setCart] = useState([]);

    const addToCart = (product) => {
        setCart(prev => [...prev , product]);
    };

    return (
        <CartContext.Provider value={{cart , addToCart}}>
            {children}
        </CartContext.Provider>
    )
}

