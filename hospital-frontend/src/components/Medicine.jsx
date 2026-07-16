import { useEffect, useState } from "react";
import "./SharedList.css";

import {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine
} from "../services/medicineService";


function Medicine() {

    const emptyMedicine = {
        medicineName: "",
        manufacturer: "",
        unitPrice: 0,
        stockQuantity: 0,
        expiryDate: "",
        category: "",
        batchNumber: ""
    };

    const [medicines, setMedicines] = useState([]);
    const [medicine, setMedicine] = useState(emptyMedicine);
    const [editId, setEditId] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    const loadMedicines = async () => {
        try {
            setLoading(true);
            const result = await getMedicines();
            setMedicines(result || []);
        } catch (err) {
            console.log(err);
            setError("Medicine loading failed");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMedicines();
    }, []);


    const handleChange = (e) => {
        setMedicine({ ...medicine, [e.target.name]: e.target.value });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (editId) {
                await updateMedicine(editId, medicine);
                alert("Updated");
            } else {
                await createMedicine(medicine);
                alert("Added");
            }
            setMedicine(emptyMedicine);
            setEditId(null);
            setShowForm(false);
            await loadMedicines();
        } catch (err) {
            console.log(err);
            alert("Save failed");
        } finally {
            setSubmitting(false);
        }
    };


    const handleEdit = (item) => {
        setMedicine({
            medicineName: item.medicineName ?? "",
            manufacturer: item.manufacturer ?? "",
            unitPrice: item.unitPrice ?? 0,
            stockQuantity: item.stockQuantity ?? 0,
            expiryDate: item.expiryDate ? item.expiryDate.substring(0, 10) : "",
            category: item.category ?? "",
            batchNumber: item.batchNumber ?? ""
        });
        setEditId(item.medicineId);
        setShowForm(true);
    };


    const handleDelete = async (id) => {
        if (!window.confirm("Delete this medicine?")) return;
        try {
            await deleteMedicine(id);
            await loadMedicines();
        } catch (err) {
            console.log(err);
        }
    };


    const filteredMedicines = medicines.filter(x =>
        x.medicineName?.toLowerCase().includes(search.toLowerCase())
    );


    if (loading) return <h3>Loading...</h3>;


    return (

        <div className="page-container">

            <div className="header-box">
                <h2>💊 Medicine Management</h2>
            </div>

            <div className="count-box">
                Total Medicine : {medicines.length}
            </div>

            <div style={{ textAlign: "center" }}>
                <button
                    className="btn-add"
                    onClick={() => {
                        setShowForm(!showForm);
                        setEditId(null);
                        setMedicine(emptyMedicine);
                    }}
                >
                    {showForm ? "❌ Close" : "➕ Add Medicine"}
                </button>
            </div>

            <input
                className="search-box"
                placeholder="Search Medicine"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />

            {error && <p style={{ color: "red" }}>{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit} className="table-container">

                    <input
                        name="medicineName"
                        placeholder="Medicine Name"
                        value={medicine.medicineName}
                        onChange={handleChange}
                    />

                    <input
                        name="manufacturer"
                        placeholder="Manufacturer"
                        value={medicine.manufacturer}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="unitPrice"
                        placeholder="Price"
                        value={medicine.unitPrice}
                        onChange={handleChange}
                    />

                    <input
                        type="number"
                        name="stockQuantity"
                        placeholder="Stock Quantity"
                        value={medicine.stockQuantity}
                        onChange={handleChange}
                    />

                    <input
                        type="date"
                        name="expiryDate"
                        value={medicine.expiryDate}
                        onChange={handleChange}
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={medicine.category}
                        onChange={handleChange}
                    />

                    <input
                        name="batchNumber"
                        placeholder="Batch Number"
                        value={medicine.batchNumber}
                        onChange={handleChange}
                    />

                    <button className="btn-add" disabled={submitting}>
                        {submitting ? "Saving..." : editId ? "Update Medicine" : "Save Medicine"}
                    </button>

                </form>
            )}

            <div className="table-container">
                <table className="data-table" width="100%">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Manufacturer</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Expiry</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredMedicines.length === 0 ? (
                            <tr>
                                <td colSpan="7">No Medicine Found</td>
                            </tr>
                        ) : (
                            filteredMedicines.map(m => (
                                <tr key={m.medicineId}>

                                    <td>{m.medicineId}</td>

                                    <td>{m.medicineName}</td>

                                    <td>{m.manufacturer}</td>

                                    <td>{m.unitPrice}</td>

                                    <td>{m.stockQuantity}</td>

                                    <td>{m.expiryDate?.substring(0, 10)}</td>

                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => handleEdit(m)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        &nbsp;
                                        <button
                                            className="btn-delete"
                                            onClick={() => handleDelete(m.medicineId)}
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

}


export default Medicine;