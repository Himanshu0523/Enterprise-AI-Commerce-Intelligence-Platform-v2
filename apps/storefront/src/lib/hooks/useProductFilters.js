// src/lib/hooks/useProductFilters.js
'use client';

import { useState, useMemo } from 'react';
import { getAllProducts } from '@/lib/api/products';
import { applyFilters, sortProducts, getUniqueCategories, getUniqueBrands, getPriceRange } from '@/lib/utils/filter-helpers';

/**
 * @typedef {Object} UseProductFiltersOptions
 * @property {string} [initialCategory]
 * @property {string} [initialQuery]
 * @property {'new'|'sale'} [collection]
 */

/**
 * Custom hook to manage product filtering and sorting state
 * @param {UseProductFiltersOptions} [options={}]
 */
export function useProductFilters(options = {}) {
  const { initialCategory, initialQuery, collection } = options;

  // Get all products (static)
  const allProducts = useMemo(() => getAllProducts(), []);

  // Filter state
  const [filters, setFilters] = useState({
    brands: [],
    priceMin: null,
    priceMax: null,
    rating: null,
  });

  const [sortBy, setSortBy] = useState('name');

  // Derived data
  const categories = useMemo(() => getUniqueCategories(allProducts), [allProducts]);
  const brands = useMemo(() => getUniqueBrands(allProducts), [allProducts]);
  const priceRange = useMemo(() => getPriceRange(allProducts), [allProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = applyFilters(allProducts, filters, initialCategory, initialQuery);
    if (collection === 'new') filtered = filtered.filter((product) => product.isNew);
    if (collection === 'sale') filtered = filtered.filter((product) => Number(product.flashSalePrice) > 0);
    filtered = sortProducts(filtered, sortBy);
    return filtered;
  }, [allProducts, filters, sortBy, initialCategory, initialQuery, collection]);

  // Setters
  const toggleBrand = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brands: prev.brands.includes(brand)
        ? prev.brands.filter((b) => b !== brand)
        : [...prev.brands, brand],
    }));
  };

  const setPriceRange = (min, max) => {
    setFilters((prev) => ({ ...prev, priceMin: min, priceMax: max }));
  };

  const setRating = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const clearFilters = () => {
    setFilters({
      brands: [],
      priceMin: null,
      priceMax: null,
      rating: null,
    });
    setSortBy('name');
  };

  return {
    allProducts,
    filteredProducts,
    filters,
    sortBy,
    categories,
    brands,
    priceRange,
    toggleBrand,
    setPriceRange,
    setRating,
    setSortBy,
    clearFilters,
    totalResults: filteredProducts.length,
  };
}