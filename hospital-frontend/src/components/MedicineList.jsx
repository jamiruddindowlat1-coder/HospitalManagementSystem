import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./SharedList.css";


const MedicineList = () => {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const navigate = useNavigate();


    // Load Medicines
    const loadMedicines = async () => {

        try {

            const response = await api.get("/Medicines");

            setMedicines(response.data);

        }
        catch (error) {

            console.log(error);
            alert("Medicine load failed");

        }
        finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        loadMedicines();

    }, []);



    // Delete Medicine
    const deleteMedicine = async (id) => {

        if (!window.confirm("Delete this medicine?"))
            return;


        try {

            await api.delete(`/Medicines/${id}`);

            setMedicines(prev =>
                prev.filter(m => m.medicineId !== id)
            );

            alert("Medicine deleted successfully");

        }
        catch (error) {

            console.log(error);
            alert("Delete failed");

        }

    };


    const filteredMedicines = medicines.filter(m =>
        m.medicineName?.toLowerCase().includes(search.toLowerCase())
    );


    if (loading) {
        return <h3>Loading...</h3>;
    }


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
                    onClick={() => navigate("/medicines/add")}
                >
                    ➕ Add Medicine
                </button>
            </div>

            <input
                className="search-box"
                placeholder="Search Medicine"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div className="table-container">

                <table className="data-table" width="100%">

                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Manufacturer</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Expiry Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredMedicines.length === 0 ? (
                            <tr>
                                <td colSpan="7">No Medicine Found</td>
                            </tr>
                        ) : (
                            filteredMedicines.map((medicine) => (
                                <tr key={medicine.medicineId}>

                                    <td>{medicine.medicineId}</td>

                                    <td>{medicine.medicineName}</td>

                                    <td>{medicine.manufacturer}</td>

                                    <td>{medicine.unitPrice}</td>

                                    <td>{medicine.stockQuantity}</td>

                                    <td>
                                        {medicine.expiryDate
                                            ? new Date(medicine.expiryDate).toLocaleDateString()
                                            : "N/A"}
                                    </td>

                                    <td>
                                        <button
                                            className="btn-delete"
                                            onClick={() => deleteMedicine(medicine.medicineId)}
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


export default MedicineList;