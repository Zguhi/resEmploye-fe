import React from "react";
import "./BookingList.css";

const BookingList = ({ bookings, onUpdateBooking, onDeleteBooking }) => (
    <div className="app__booking-list">
        <h2>Booking List</h2>
        {bookings.map((booking) => (
            <div key={booking.id} className="booking-table">
                <div className="booking-row">
                    <div className="booking-cell">Customer Name</div>
                    <div className="booking-cell">{booking.name}</div>
                </div>
                <div className="booking-row">
                    <div className="booking-cell">Email</div>
                    <div className="booking-cell">{booking.email}</div>
                </div>
                <div className="booking-row">
                    <div className="booking-cell">Date</div>
                    <div className="booking-cell">{booking.date}</div>
                </div>
                <div className="booking-row">
                    <div className="booking-cell">Time</div>
                    <div className="booking-cell">{booking.time}</div>
                </div>
                <div className="booking-row">
                    <div className="booking-cell">Number of Guests</div>
                    <div className="booking-cell">{booking.numGuests}</div>
                </div>
                <div className="booking-actions">
                    <button onClick={() => onUpdateBooking(booking)}>Edit</button>
                    <button onClick={() => onDeleteBooking(booking.id)}>Delete</button>
                </div>
            </div>
        ))}
    </div>
);

export default BookingList;