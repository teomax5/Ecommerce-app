import React, { useEffect, useState } from "react";
import API from "../services/api";

const withProducts = (WrappedComponent) => {
  return (props) => {
    const [loading, setLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [cursor, setCursor] = useState(null);

    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [sort, setSort] = useState("");
    const [offset, setOffset] = useState(0);

    // 🔥 FETCH PRODUCTS
    const fetchProducts = async (reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        let url = `/products?limit=8`;

        const min = minPrice !== "" ? Number(minPrice) : null;
        const max = maxPrice !== "" ? Number(maxPrice) : null;

        if (!sort && cursor !== null && !reset) {
          url += `&cursor=${cursor}`;
        }

        if (selectedCategory !== null) {
          url += `&category_id=${selectedCategory}`;
        }

        if (debouncedSearch) {
          url += `&search=${debouncedSearch}`;
        }

        if (sort) {
          url += `&sort=${sort}&offset=${offset}`;
        }

        if (min !== null) url += `&min_price=${min}`;
        if (max !== null) url += `&max_price=${max}`;

        const res = await API.get(url);

        if (!res.data?.length) return;

        if (reset) {
          setProducts(res.data);
        } else {
          setProducts((prev) => [...prev, ...res.data]);
        }

        if (sort) {
          setOffset((prev) => prev + 8);
        } else {
          setCursor(res.data[res.data.length - 1].id);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    // 🔥 FETCH CATEGORIES
    useEffect(() => {
      API.get("/categories").then((res) => setCategories(res.data));
    }, []);

    // 🔥 SEARCH DEBOUNCE
    useEffect(() => {
      const t = setTimeout(() => setDebouncedSearch(search), 500);
      return () => clearTimeout(t);
    }, [search]);

    // 🔥 INITIAL LOAD
    useEffect(() => {
      fetchProducts(true);
    }, []);

    // 🔥 FILTER CHANGE
    useEffect(() => {
      setProducts([]);
      setCursor(null);
      setOffset(0);
      fetchProducts(true);
    }, [selectedCategory, debouncedSearch, sort, minPrice, maxPrice]);

    // 🔥 INFINITE SCROLL
    useEffect(() => {
      const handleScroll = () => {
        if (loading) return;

        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100
        ) {
          fetchProducts(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }, [cursor, sort, offset, loading]);

    return (
      <WrappedComponent
        {...props}
        loading={loading}
        products={products}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        search={search}
        setSearch={setSearch}
        minPrice={minPrice}
        setMinPrice={setMinPrice}
        maxPrice={maxPrice}
        setMaxPrice={setMaxPrice}
        sort={sort}
        setSort={setSort}
        fetchProducts={fetchProducts}
      />
    );
  };
};

export default withProducts;