import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SharedList.css";

function LabResultList() {

    const navigate = useNavigate();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        result: "",
        remarks: "",
        status: "Pending",
    });


    const loadLabResults = async () => {

        try {

            setLoading(true);

            const response = await api.get("/LabResults");

            setResults(response.data || []);

        } catch (error) {

            console.log(error);
            setMessage("Lab Result load করতে সমস্যা হয়েছে");

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadLabResults();

    }, []);


    const getItemId = (item) => item.id ?? item.labResultId;


    const startEdit = (item) => {

        setEditingItem(item);

        setFormData({
            result: item.result || "",
            remarks: item.remarks || "",
            status: item.status || "Pending",
        });

    };


    const cancelEdit = () => {

        setEditingItem(null);

        setFormData({ result: "", remarks: "", status: "Pending" });

    };


    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

    };


    const handleUpdate = async (e) => {

        e.preventDefault();

        try {

            const id = getItemId(editingItem);

            await api.put(`/LabResults/${id}`, {
                ...editingItem,
                result: formData.result,
                remarks: formData.remarks,
                status: formData.status,
            });

            setMessage("Lab Result আপডেট হয়েছে");

            cancelEdit();

            loadLabResults();

        } catch (error) {

            console.log(error);
            setMessage("Update করতে সমস্যা হয়েছে");

        }

    };


    const handleDelete = async (item) => {

        const id = getItemId(item);

        if (!window.confirm("আপনি কি নিশ্চিত এই Lab Result ডিলিট করতে চান?")) {
            return;
        }

        try {

            await api.delete(`/LabResults/${id}`);

            setMessage("Lab Result ডিলিট হয়েছে");

            loadLabResults();

        } catch (error) {

            console.log(error);
            setMessage("Delete করতে সমস্যা হয়েছে");

        }

    };


    const filteredResults = results.filter((item) =>
        (item.patient?.fullName || "").toLowerCase().includes(search.toLowerCase())
    );


    if (loading) return <h3>Loading...</h3>;


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>🧪 Lab Results Management</h2>
            </div>

            <div className="count-box">
                Total Results : {results.length}
            </div>

            <div style={{ textAlign: "center" }}>
                <button
                    className="btn-add"
                    onClick={() => navigate("/lab-results/add")}
                >
                    ➕ Add Lab Result
                </button>
            </div>

            {message && (
                <p style={{ color: "#dc2626", textAlign: "center", fontWeight: 600 }}>
                    {message}
                </p>
            )}

            <input
                type="text"
                placeholder="Search by patient name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-box"
            />

            {editingItem && (

                <form onSubmit={handleUpdate} className="edit-form-box" style={{ margin: "16px 0", padding: "16px", border: "1px solid #ddd", borderRadius: "8px" }}>

                    <h4>Edit Lab Result — {editingItem.patient?.fullName || ""}</h4>

                    <div style={{ marginBottom: "8px" }}>
                        <label>Result: </label>
                        <input
                            type="text"
                            name="result"
                            value={formData.result}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label>Remarks: </label>
                        <input
                            type="text"
                            name="remarks"
                            value={formData.remarks}
                            onChange={handleChange}
                        />
                    </div>

                    <div style={{ marginBottom: "8px" }}>
                        <label>Status: </label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value="Pending">Pending</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <button type="submit" className="btn-add">Save</button>
                    <button type="button" className="btn-delete" onClick={cancelEdit} style={{ marginLeft: "8px" }}>Cancel</button>

                </form>

            )}

            <div className="table-container">

                <table className="data-table">

                    <thead>

                        <tr>

                            <th>ID</th>
                            <th>Patient</th>
                            <th>Test</th>
                            <th>Result</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Action</th>

                        </tr>

                    </thead>


                    <tbody>


                        {
                            filteredResults.length > 0 ? (

                                filteredResults.map((item) => (

                                    <tr key={getItemId(item)}>


                                        <td>
                                            {getItemId(item)}
                                        </td>


                                        <td>
                                            {
                                                item.patient?.fullName
                                                || "-"
                                            }
                                        </td>


                                        <td>
                                            {
                                                item.labTest?.testName
                                                || item.labTest?.name
                                                || "-"
                                            }
                                        </td>


                                        <td>
                                            {item.result}
                                        </td>


                                        <td>
                                            {item.remarks}
                                        </td>


                                        <td>
                                            <span className={item.status === "Completed" ? "badge-active" : "badge-inactive"}>
                                                {item.status}
                                            </span>
                                        </td>


                                        <td>

                                            {
                                                item.createdAt
                                                ?
                                                new Date(
                                                    item.createdAt
                                                ).toLocaleDateString()
                                                :
                                                "-"
                                            }

                                        </td>


                                        <td style={{ whiteSpace: "nowrap" }}>
                                            <button className="btn-edit" onClick={() => startEdit(item)}>✏ Edit</button>
                                            <button className="btn-delete" onClick={() => handleDelete(item)} style={{ marginLeft: "6px" }}>🗑 Delete</button>
                                        </td>


                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td colSpan="8" style={{ textAlign: "center" }}>
                                        No Lab Result Found
                                    </td>

                                </tr>

                            )
                        }


                    </tbody>


                </table>

            </div>


        </div>

    );

}


export default LabResultList;