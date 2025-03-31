import React, { useState } from "react";
import { BookingForm, BookingList } from "../../components";
import "./Bookings.css";

const Bookings = () => {
    const [bookings, setBookings] = useState([]);

    const handleAddBooking = (booking) => {
        setBookings([...bookings, booking]);
    };

    const handleUpdateBooking = (updatedBooking) => {
        setBookings(
            bookings.map((booking) =>
                booking.id === updatedBooking.id ? updatedBooking : booking
            )
        );
    };

    const handleDeleteBooking = (id) => {
        setBookings(bookings.filter((booking) => booking.id !== id));
    };

    return (
        <div className="app__bookings">
            <h1>Bookings</h1>
            <BookingForm onAddBooking={handleAddBooking} />
            <BookingList
                bookings={bookings}
                onUpdateBooking={handleUpdateBooking}
                onDeleteBooking={handleDeleteBooking}
            />
        </div>
    );
};

export default Bookings;