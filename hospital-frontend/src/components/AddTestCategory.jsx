import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SharedList.css";


const AddTestCategory = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true
    });

    const [submitting, setSubmitting] = useState(false);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.name.trim()) {
            alert("Test category name is required");
            return;
        }

        setSubmitting(true);

        try {

            await api.post("/TestCategories", formData);

            alert("Test category created successfully");

            navigate("/test-categories");

        }
        catch (error) {

            console.log(error);
            alert("Failed to create test category");

        }
        finally {

            setSubmitting(false);

        }

    };


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>➕ Add Test Category</h2>
            </div>

            <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "20px auto" }}>

                <div style={{ marginBottom: "15px" }}>
                    <label>Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="search-box"
                        placeholder="e.g. Hematology"
                        required
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="search-box"
                        placeholder="e.g. Blood related tests"
                        rows="3"
                    />
                </div>

                <div style={{ marginBottom: "15px" }}>
                    <label>
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        {" "}Active
                    </label>
                </div>

                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        className="btn-add"
                        disabled={submitting}
                    >
                        {submitting ? "Saving..." : "💾 Save"}
                    </button>

                    <button
                        type="button"
                        className="btn-delete"
                        style={{ marginLeft: "10px" }}
                        onClick={() => navigate("/test-categories")}
                    >
                        ❌ Cancel
                    </button>
                </div>

            </form>

        </div>

    );

};


export default AddTestCategory;