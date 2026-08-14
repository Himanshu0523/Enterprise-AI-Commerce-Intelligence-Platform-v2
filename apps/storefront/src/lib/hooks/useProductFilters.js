// src/lib/hooks/useProductFilters.js
'use client';

import { useState, useMemo } from 'react';
import { getAllProducts } from '@/lib/api/products';
import { applyFilters, sortProducts, getUniqueCategories, getUniqueBrands, getPriceRange } from '@/lib/utils/filter-helpers';

/**
 * @typedef {Object} UseProductFiltersOptions
 * @property {string} [initialCategory]
 * @property {string} [initialQuery]
 */

/**
 * Custom hook to manage product filtering and sorting state
 * @param {UseProductFiltersOptions} [options={}]
 */
export function useProductFilters(options = {}) {
  const { initialCategory, initialQuery } = options;

  // Get all products (static)
  const allProducts = useMemo(() => getAllProducts(), []);

  // Filter state
  const [filters, setFilters] = useState({
    brands: [],
    priceMin: null,
    priceMax: null,
    rating: null,
  });

  const [sortBy, setSortBy] = useState('rating');

  // Derived data
  const categories = useMemo(() => getUniqueCategories(allProducts), [allProducts]);
  const brands = useMemo(() => getUniqueBrands(allProducts), [allProducts]);
  const priceRange = useMemo(() => getPriceRange(allProducts), [allProducts]);

  // Apply filters and sorting
  const filteredProducts = useMemo(() => {
    let filtered = applyFilters(allProducts, filters, initialCategory, initialQuery);
    filtered = sortProducts(filtered, sortBy);
    return filtered;
  }, [allProducts, filters, sortBy, initialCategory, initialQuery]);

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
    setSortBy('rating');
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