import React, { useState } from "react";
import "./BookingForm.css";

const BookingForm = ({ onAddBooking }) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        time: "",
        guests: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddBooking({ ...formData, id: Date.now() });
        setFormData({
            name: "",
            email: "",
            date: "",
            time: "",
            guests: "",
        });
    };

    return (
        <form className="app__booking-form" onSubmit={handleSubmit}>
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
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
            />
            <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
            />
            <input
                type="number"
                name="guests"
                placeholder="Number of Guests"
                value={formData.guests}
                onChange={handleChange}
                required
            />
            <button type="submit">Book Now</button>
        </form>
    );
};

export default BookingForm;