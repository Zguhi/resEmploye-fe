import React, { useState } from "react";
import "./CustomerForm.css";

const CustomerForm = ({ onAddCustomer }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCustomer(formData);
        setFormData({
            name: "",
            email: "",
            phone: "",
        });
    };

    return (
        <form className="app__customer-form" onSubmit={handleSubmit}>
            <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={handleChange}
                required
            />
            <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
            />
            <input
                type="tel"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                required
            />
            <button type="submit">Add Customer</button>
        </form>
    );
};

export default CustomerForm;