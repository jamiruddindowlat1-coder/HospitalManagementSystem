import { useEffect, useState } from "react";

import {
    getMedicines,
    createMedicine,
    updateMedicine,
    deleteMedicine
} from "../services/medicineService";


function Medicine() {


    const emptyMedicine = {
        medicineName:"",
        manufacturer:"",
        unitPrice:0,
        stockQuantity:0,
        expiryDate:"",
        category:"",
        batchNumber:""
    };


    const [medicines,setMedicines] = useState([]);

    const [medicine,setMedicine] =
        useState(emptyMedicine);

    const [editId,setEditId] = useState(null);

    const [showForm,setShowForm] = useState(false);

    const [search,setSearch] = useState("");

    const [error,setError] = useState("");

    const [loading,setLoading] = useState(false);



    const loadMedicines = async()=>{

        try{

            setLoading(true);

            const result = await getMedicines();

            setMedicines(result || []);

        }
        catch(err){

            console.log(err);

            setError("Medicine loading failed");

        }
        finally{

            setLoading(false);

        }

    };




    useEffect(()=>{

        loadMedicines();

    },[]);




    const handleChange=(e)=>{


        setMedicine({

            ...medicine,

            [e.target.name]:e.target.value

        });


    };




    const handleSubmit=async(e)=>{

        e.preventDefault();


        try{


            if(editId){

                await updateMedicine(
                    editId,
                    medicine
                );

                alert("Updated");

            }
            else{

                await createMedicine(
                    medicine
                );

                alert("Added");

            }



            setMedicine(emptyMedicine);

            setEditId(null);

            setShowForm(false);


            await loadMedicines();


        }
        catch(err){

            console.log(err);

            alert("Save failed");

        }


    };





    const handleEdit=(item)=>{


        setMedicine({

            medicineName:item.medicineName ?? "",

            manufacturer:item.manufacturer ?? "",

            unitPrice:item.unitPrice ?? 0,

            stockQuantity:item.stockQuantity ?? 0,

            expiryDate:
            item.expiryDate
            ?
            item.expiryDate.substring(0,10)
            :
            "",

            category:item.category ?? "",

            batchNumber:item.batchNumber ?? ""

        });


        setEditId(item.medicineId);

        setShowForm(true);


    };





    const handleDelete=async(id)=>{


        if(!window.confirm(
            "Delete this medicine?"
        ))

        return;



        try{

            await deleteMedicine(id);

            await loadMedicines();

        }
        catch(err){

            console.log(err);

        }

    };





    const filteredMedicines =
    medicines.filter(x=>

        x.medicineName
        ?.toLowerCase()
        .includes(
            search.toLowerCase()
        )

    );





    const total =
    medicines.length;


    const available =
    medicines.filter(
        x=>x.stockQuantity>10
    ).length;


    const low =
    medicines.filter(
        x=>
        x.stockQuantity>0 &&
        x.stockQuantity<=10
    ).length;


    const out =
    medicines.filter(
        x=>x.stockQuantity<=0
    ).length;




    if(loading)

        return <h3>Loading...</h3>;





return (

<div className="container">


<h2>💊 Medicine Management</h2>



<div style={{
display:"flex",
gap:"20px"
}}>


<div className="card">
💊 Total
<h2>{total}</h2>
</div>


<div className="card">
✅ Available
<h2>{available}</h2>
</div>


<div className="card">
⚠ Low Stock
<h2>{low}</h2>
</div>


<div className="card">
❌ Out Stock
<h2>{out}</h2>
</div>


</div>




<br/>


{
error &&
<p style={{color:"red"}}>
{error}
</p>
}





<button
onClick={()=>{

setShowForm(!showForm);

setEditId(null);

setMedicine(emptyMedicine);

}}

>

{
showForm
?
"Close"
:
"➕ Add Medicine"
}

</button>




<br/><br/>



<input

placeholder="Search Medicine"

value={search}

onChange={
e=>setSearch(e.target.value)
}

/>




{
showForm &&


<form onSubmit={handleSubmit}>


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
placeholder="Stock"
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



<button>

{
editId
?
"Update"
:
"Save"
}

</button>



</form>


}




<br/><br/>




<table border="1" width="100%">


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


{
filteredMedicines.map(m=>(

<tr key={m.medicineId}>


<td>{m.medicineId}</td>

<td>{m.medicineName}</td>

<td>{m.manufacturer}</td>

<td>{m.unitPrice}</td>

<td>{m.stockQuantity}</td>


<td>
{
m.expiryDate?.substring(0,10)
}
</td>


<td>


<button
onClick={()=>handleEdit(m)}
>
✏ Edit
</button>


<button
onClick={()=>handleDelete(m.medicineId)}
>
🗑 Delete
</button>


</td>


</tr>


))
}



</tbody>


</table>


</div>


);


}


export default Medicine;