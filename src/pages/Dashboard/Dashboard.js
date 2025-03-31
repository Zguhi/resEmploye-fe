import React, { useState, useEffect } from "react";
import CustomerForm from "../../components/CustomerForm/CustomerForm";
import CustomerList from "../../components/CustomerList/CustomerList";
import "./Dashboard.css";

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCustomers();
        };
        fetchData();
    }, []);

    const fetchCustomers = async () => {
        try {
            const response = await fetch("API_URL_HERE");
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // ... rest of the code ...

    return (
        <div className="app__dashboard">
            <h1>Customer Management</h1>
            <CustomerForm onAddCustomer={handleAddCustomer} />
            <CustomerList
                customers={customers}
                onUpdateCustomer={handleUpdateCustomer}
                onDeleteCustomer={handleDeleteCustomer}
            />
        </div>
    );
};

export default Dashboard;