import { useEffect, useState } from "react";
import api from "../services/api";
import "./SharedList.css";

function Reports() {

    const [type, setType] = useState("patients");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const reports = [
        { key: "patients", label: "👥 Patients Report" },
        { key: "doctors", label: "👨‍⚕️ Doctors Report" },
        { key: "appointments", label: "📅 Appointment Report" },
        { key: "admissions", label: "🏥 Admission Report" },
        { key: "medicines", label: "💊 Medicine Report" },
        { key: "billing", label: "💰 Billing Report" },
        { key: "medicalrecords", label: "📋 Medical Records" }
    ];


    const loadReport = async () => {

        try {

            setLoading(true);

            const response = await api.get(`/reports/${type}`);

            setData(response.data || []);

        }
        catch(error){

            console.log(error);
            setData([]);

        }
        finally{

            setLoading(false);

        }

    };


    useEffect(()=>{

        loadReport();

    },[type]);



    const exportCSV = () => {

        if(data.length===0) return;


        const csv =
        [
            Object.keys(data[0]).join(","),
            ...data.map(row =>
                Object.values(row).join(",")
            )
        ].join("\n");


        const blob = new Blob(
            [csv],
            {type:"text/csv"}
        );


        const url = URL.createObjectURL(blob);


        const a=document.createElement("a");

        a.href=url;
        a.download=`${type}-report.csv`;

        a.click();

    };



    return (

        <div className="page-container">

            <div className="header-box">
                <h2>📊 Reports Management</h2>
            </div>

            <div style={{
                display:"flex",
                gap:"10px",
                flexWrap:"wrap",
                justifyContent:"center",
                marginBottom:"15px"
            }}>

            {
                reports.map(r=>(

                    <button
                    key={r.key}
                    className={type === r.key ? "btn-add" : "btn-edit"}
                    onClick={()=>setType(r.key)}
                    >

                    {r.label}

                    </button>

                ))
            }

            </div>

            <div style={{textAlign:"center", marginBottom:"15px"}}>
                <button
                className="btn-add"
                onClick={exportCSV}
                >

                📊 Export Excel (CSV)

                </button>
            </div>

            {
                loading ?

                <h3 style={{textAlign:"center"}}>Loading Report...</h3>

                :


                <div className="table-container">

                <table className="data-table">


                <thead>

                <tr>

                {
                    data.length>0 &&
                    Object.keys(data[0])
                    .map(key=>(

                        <th key={key}>
                            {key}
                        </th>

                    ))
                }

                </tr>

                </thead>



                <tbody>

                {
                    data.length === 0 ? (
                        <tr>
                            <td style={{textAlign:"center"}}>No data found.</td>
                        </tr>
                    ) :

                    data.map((row,index)=>(

                        <tr key={index}>

                        {
                            Object.values(row)
                            .map((value,i)=>(

                                <td key={i}>
                                    {
                                    typeof value==="object"
                                    ?
                                    "-"
                                    :
                                    value
                                    }
                                </td>

                            ))
                        }


                        </tr>

                    ))
                }


                </tbody>


                </table>

                </div>


            }



        </div>

    );

}


export default Reports;