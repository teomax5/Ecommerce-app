import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProductsUI = ({
  loading,
  products,
  categories,
  selectedCategory,
  setSelectedCategory,
  search,
  setSearch,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sort,
  setSort,
  fetchProducts
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ background: "#f1f3f6", minHeight: "100vh" }}>

      {/* 🔵 HEADER */}
      <div
        style={{
          background: "#2874f0",
          color: "#fff",
          padding: "15px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>Shopzo</h2>
        <div>
          {user?.email} |{" "}
          <button onClick={logout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ display: "flex", padding: "20px" }}>

        {/* 🧾 SIDEBAR */}
        <div
          style={{
            width: "250px",
            background: "#fff",
            padding: "15px",
            borderRadius: "8px",
            marginRight: "20px",
            height: "fit-content",
          }}
        >
          <h4>Filters</h4>

          {/* CATEGORY */}
          <label>Category</label>
          <select
            value={selectedCategory || ""}
            onChange={(e) =>
              setSelectedCategory(e.target.value === "" ? null : Number(e.target.value))
            }
            style={{ width: "100%", marginBottom: "10px" }}
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* PRICE */}
          <label>Price</label>
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            style={{ width: "100%", marginBottom: "5px" }}
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            style={{ width: "100%", marginBottom: "10px" }}
          />

          <button
            onClick={() => fetchProducts(true)}
            style={{
              width: "100%",
              background: "#2874f0",
              color: "#fff",
              padding: "8px",
              border: "none",
              borderRadius: "5px",
            }}
          >
            Apply
          </button>

          {/* SORT */}
          <h4 style={{ marginTop: "15px" }}>Sort</h4>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ width: "100%" }}
          >
            <option value="">Default</option>
            <option value="price_asc">Low → High</option>
            <option value="price_desc">High → Low</option>
          </select>
        </div>

        {/* 🛍️ MAIN */}
        <div style={{ flex: 1 }}>

          {/* ➕ ADD PRODUCT */}
          <button
            onClick={() => navigate("/add-product")}
            style={{
              marginBottom: "15px",
              background: "#2874f0",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            + Add Product
          </button>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search for products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "10px",
              marginBottom: "20px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />

          {/* PRODUCTS GRID */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "20px",
            }}
          >
            {products.map((p) => (
              <div
                key={p.id}
                style={{
                  position: "relative",
                  background: "#fff",
                  padding: "15px",
                  borderRadius: "8px",
                  boxShadow: "0 1px 5px rgba(0,0,0,0.1)",
                }}
              >
                {/* ✏️ EDIT */}
                <button
                  onClick={() => navigate(`/add-product/${p.id}`)}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "50%",
                    cursor: "pointer",
                  }}
                >
                  ✏️
                </button>

                <h4>{p.name}</h4>
                <p style={{ fontWeight: "bold" }}>₹{p.price}</p>
                <p style={{ fontSize: "13px", color: "#555" }}>
                  {p.description?.slice(0, 50)}...
                </p>
                <p style={{ fontSize: "12px", color: "gray" }}>
                  {p.category?.name}
                </p>
              </div>
            ))}
          </div>

          {/* LOADING */}
          {loading && (
            <p style={{ textAlign: "center", marginTop: "20px" }}>
              Loading...
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsUI;