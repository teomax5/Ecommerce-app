import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category_id: ""
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🟡 FETCH PRODUCT FOR EDIT
  useEffect(() => {
    if (id) {
      setLoading(true);

      API.get(`/products/${id}`)
        .then((res) => {
          setForm(res.data);
          setOriginalForm(res.data);
        })
        .catch((err) => {
          console.error(err);
          alert("Product not found");
          navigate("/products");
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

  // 🔄 HANDLE INPUT
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔥 SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // 🚨 prevent crash
        if (!originalForm) {
          alert("Please wait, loading product...");
          return;
        }

        const updatedFields = {};

        Object.keys(form).forEach((key) => {
          if (form[key] !== originalForm[key]) {
            updatedFields[key] = form[key];
          }
        });

        if (Object.keys(updatedFields).length === 0) {
          alert("No changes made");
          return;
        }

        await API.patch(`/products/${id}`, updatedFields);
        alert("Product updated successfully");
      } else {
        await API.post("/products", form);
        alert("Product added successfully");
      }

      navigate("/products");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  // 🟡 LOADING UI (IMPORTANT)
  if (id && loading) {
    return <h3 style={{ padding: "30px" }}>Loading product...</h3>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>{id ? "Edit Product" : "Add Product"}</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          maxWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}
      >
        {/* NAME */}
        <input
          name="name"
          placeholder={
            id && originalForm ? `Current: ${originalForm.name}` : "Name"
          }
          value={form.name || ""}
          onChange={handleChange}
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder={
            id && originalForm
              ? `Current: ${originalForm.description}`
              : "Description"
          }
          value={form.description || ""}
          onChange={handleChange}
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder={
            id && originalForm
              ? `Current: ${originalForm.price}`
              : "Price"
          }
          value={form.price || ""}
          onChange={handleChange}
        />

        {/* CATEGORY */}
        <input
          type="number"
          name="category_id"
          placeholder={
            id && originalForm
              ? `Current: ${originalForm.category_id}`
              : "Category ID"
          }
          value={form.category_id || ""}
          onChange={handleChange}
        />

        {/* SUBMIT */}
        <button
          type="submit"
          style={{
            background: "#2874f0",
            color: "#fff",
            padding: "10px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {id ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;