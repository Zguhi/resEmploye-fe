import React from "react";
import "./BookingList.css";

const BookingList = ({ bookings, onUpdateBooking, onDeleteBooking }) => (
    <table className="app__booking-list">
        <thead>
        <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date</th>
            <th>Time</th>
            <th>Guests</th>
            <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {bookings.map((booking) => (
            <tr key={booking.id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.date}</td>
                <td>{booking.time}</td>
                <td>{booking.guests}</td>
                <td>
                    <button onClick={() => onUpdateBooking(booking)}>Edit</button>
                    <button onClick={() => onDeleteBooking(booking.id)}>Delete</button>
                </td>
            </tr>
        ))}
        </tbody>
    </table>
);

export default BookingList;