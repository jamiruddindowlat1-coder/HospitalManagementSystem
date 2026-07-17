import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import "./SharedList.css";

const EditTestCategory = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        isActive: true
    });

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);


    const loadCategory = async () => {

        try {

            const response = await api.get(`/TestCategories/${id}`);

            setFormData({
                name: response.data.name || "",
                description: response.data.description || "",
                isActive: response.data.isActive,
            });

        } catch (error) {

            console.log(error);
            alert("Test category load failed");

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCategory();

    }, [id]);


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

            await api.put(`/TestCategories/${id}`, formData);

            alert("Test category updated successfully");

            navigate("/test-categories");

        } catch (error) {

            console.log(error);
            alert("Failed to update test category");

        } finally {

            setSubmitting(false);

        }

    };


    if (loading) {
        return <h3>Loading...</h3>;
    }


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>✏ Edit Test Category</h2>
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
                        {submitting ? "Saving..." : "Save"}
                    </button>
                    <button
                        type="button"
                        className="btn-delete"
                        style={{ marginLeft: "10px" }}
                        onClick={() => navigate("/test-categories")}
                    >
                        Cancel
                    </button>
                </div>

            </form>

        </div>

    );

};

export default EditTestCategory;