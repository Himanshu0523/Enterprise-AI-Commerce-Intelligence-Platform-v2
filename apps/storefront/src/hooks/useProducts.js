import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";

export const useProducts = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    getProducts()
      .then(res => setProducts(res.data.data || res.data || []))
      .catch(err => console.log(err));
  }, []);

  return products;
};