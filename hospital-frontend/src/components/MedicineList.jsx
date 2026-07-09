import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";


const MedicineList = () => {

    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);

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
                prev.filter(
                    medicine =>
                    medicine.medicineId !== id
                )
            );


            alert("Medicine deleted successfully");

        }
        catch (error) {

            console.log(error);
            alert("Delete failed");

        }

    };



    if (loading) {

        return <h3>Loading...</h3>;

    }



    return (

        <div>


            <h2>Medicine List</h2>



            <button
                onClick={() => navigate("/medicines/add")}
            >
                + Add Medicine
            </button>



            <br />
            <br />


            <table border="1" width="100%">


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


                    {
                        medicines.length === 0 ? (

                            <tr>

                                <td colSpan="7">
                                    No Medicine Found
                                </td>

                            </tr>


                        ) : (


                            medicines.map((medicine) => (

                                <tr key={medicine.medicineId}>


                                    <td>
                                        {medicine.medicineId}
                                    </td>


                                    <td>
                                        {medicine.medicineName}
                                    </td>


                                    <td>
                                        {medicine.manufacturer}
                                    </td>


                                    <td>
                                        {medicine.unitPrice}
                                    </td>


                                    <td>
                                        {medicine.stockQuantity}
                                    </td>


                                    <td>

                                    {
                                        medicine.expiryDate
                                        ?
                                        new Date(
                                            medicine.expiryDate
                                        ).toLocaleDateString()
                                        :
                                        "N/A"
                                    }

                                    </td>



                                    <td>


                                        <button
                                            onClick={() =>
                                                deleteMedicine(
                                                    medicine.medicineId
                                                )
                                            }
                                        >
                                            Delete
                                        </button>


                                    </td>


                                </tr>


                            ))

                        )
                    }


                </tbody>


            </table>


        </div>

    );

};


export default MedicineList;