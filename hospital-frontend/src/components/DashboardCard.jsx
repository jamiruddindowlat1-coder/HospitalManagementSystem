import React from "react";
import "./DashboardCards.css";

const DashboardCards = ({ data }) => {

    const cards = [
        { title: "Doctors", value: data?.doctors || 0 },
        { title: "Patients", value: data?.patients || 0 },
        { title: "Appointments", value: data?.appointments || 0 },
        { title: "Admissions", value: data?.admissions || 0 },
        { title: "Medical Records", value: data?.medicalRecords || 0 },
        { title: "Medicine", value: data?.medicines || 0 },
        { title: "Available", value: data?.available || 0 },
        { title: "Low Stock", value: data?.lowStock || 0 },
        { title: "Out Stock", value: data?.outStock || 0 }
    ];


    return (
        <div className="dashboard-cards">

            {cards.map((card,index)=>(
                <div className="dashboard-card" key={index}>
                    <h2>{card.value}</h2>
                    <p>{card.title}</p>
                </div>
            ))}

        </div>
    );
};

export default DashboardCards;