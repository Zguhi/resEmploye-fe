import React from "react";
import "./CustomerList.css";

const CustomerList = ({ customers, onUpdateCustomer, onDeleteCustomer }) => (
    <table className="app__customer-list">
        <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {customers.map((customer) => (
            <tr key={customer.id}>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>
                    <button onClick={() => onUpdateCustomer(customer)}>Edit</button>
                    <button onClick={() => onDeleteCustomer(customer.id)}>Delete</button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
);

export default CustomerList;