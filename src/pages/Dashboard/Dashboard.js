import React, { useState, useEffect } from "react";
import CustomerForm from "../../components/CustomerForm/CustomerForm";
import CustomerList from "../../components/CustomerList/CustomerList";
import "./Dashboard.css";

const Dashboard = () => {
    const [customers, setCustomers] = useState([]);
    const [editingCustomer, setEditingCustomer] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            await fetchCustomers();
        };
        fetchData();
    }, []);

    const fetchCustomers = async () => {
        try {
            // Thay thế "API_URL_HERE" bằng URL thực tế của API
            const response = await fetch("");
            const data = await response.json();
            setCustomers(data);
        } catch (error) {
            console.error("Error fetching customers:", error);
        }
    };

    // Hàm thêm khách hàng mới
    const handleAddCustomer = (newCustomer) => {
        const customerWithId = {
            ...newCustomer,
            id: customers.length > 0
                ? Math.max(...customers.map(c => c.id)) + 1
                : 1
        };
        setCustomers([...customers, customerWithId]);
    };

    // Hàm cập nhật thông tin khách hàng
    const handleUpdateCustomer = (updatedCustomer) => {
        setCustomers(customers.map(customer =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
        ));
        setEditingCustomer(null);
    };

    // Hàm xóa khách hàng
    const handleDeleteCustomer = (customerId) => {
        setCustomers(customers.filter(customer => customer.id !== customerId));
    };

    // Hàm bắt đầu chỉnh sửa khách hàng
    const startEditCustomer = (customer) => {
        setEditingCustomer(customer);
    };

    return (
        <div className="app__dashboard">
            <h1>Customer Management</h1>
            <CustomerForm
                key={editingCustomer ? editingCustomer.id : 'add'}
                onAddCustomer={editingCustomer
                    ? handleUpdateCustomer
                    : handleAddCustomer
                }
                initialData={editingCustomer || {
                    name: '',
                    email: '',
                    phone: ''
                }}
            />
            <CustomerList
                customers={customers}
                onUpdateCustomer={startEditCustomer}
                onDeleteCustomer={handleDeleteCustomer}
            />
        </div>
    );
};

export default Dashboard;