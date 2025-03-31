import React, { useState, useEffect } from "react";
import "./CustomerForm.css";

const CustomerForm = ({ onAddCustomer, initialData = {} }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    // Cập nhật form khi initialData thay đổi
    useEffect(() => {
        setFormData({
            name: initialData.name || "",
            email: initialData.email || "",
            phone: initialData.phone || "",
        });
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Nếu initialData có id, nghĩa là đang ở chế độ chỉnh sửa
        const submissionData = initialData.id
            ? { ...formData, id: initialData.id }
            : formData;

        onAddCustomer(submissionData);

        // Reset form sau khi submit
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
            <button type="submit">
                {initialData.id ? "Update Customer" : "Add Customer"}
            </button>
        </form>
    );
};

export default CustomerForm;