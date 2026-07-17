import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SharedList.css";


const TestCategoryList = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    // Load Test Categories
    const loadCategories = async () => {

        try {

            const response = await api.get("/TestCategories");

            setCategories(response.data);

        }
        catch (error) {

            console.log(error);
            alert("Test Category load failed");

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadCategories();

    }, []);


    // Delete Test Category
    const deleteCategory = async (id) => {

        if (!window.confirm("Delete this test category?"))
            return;


        try {

            await api.delete(`/TestCategories/${id}`);

            setCategories(prev =>
                prev.filter(c => c.testCategoryId !== id)
            );

            alert("Test category deleted successfully");

        }
        catch (error) {

            console.log(error);
            alert("Delete failed");

        }

    };


    // Navigate to Edit page
    const editCategory = (id) => {

        navigate(`/test-categories/edit/${id}`);

    };


    const filteredCategories = categories.filter(c =>
        c.name?.toLowerCase().includes(search.toLowerCase())
    );


    if (loading) {
        return <h3>Loading...</h3>;
    }


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>🧪 Test Category Management</h2>
            </div>

            <div className="count-box">
                Total Categories : {categories.length}
            </div>

            <div style={{ textAlign: "center" }}>
                <button
                    className="btn-add"
                    onClick={() => navigate("/test-categories/add")}
                >
                    ➕ Add Test Category
                </button>
            </div>

            <input
                className="search-box"
                placeholder="Search Test Category"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="table-container">

                <table className="data-table" width="100%">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Status</th>
                            <th>Created</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredCategories.length === 0 ? (
                            <tr>
                                <td colSpan="6">No Test Category Found</td>
                            </tr>
                        ) : (
                            filteredCategories.map((category) => (
                                <tr key={category.testCategoryId}>

                                    <td>{category.testCategoryId}</td>

                                    <td>{category.name}</td>

                                    <td>{category.description || "N/A"}</td>

                                    <td>{category.isActive ? "Active" : "Inactive"}</td>

                                    <td>
                                        {category.createdAt
                                            ? new Date(category.createdAt).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => editCategory(category.testCategoryId)}
                                        >
                                            ✏ Edit
                                        </button>

                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteCategory(category.testCategoryId)}
                                        >
                                            🗑 Delete
                                        </button>
                                    </td>

                                </tr>
                            ))
                        )}
                    </tbody>

                </table>

            </div>

        </div>

    );

};


export default TestCategoryList;