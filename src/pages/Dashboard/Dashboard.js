import React, { useState, useEffect } from "react";
import BookingList from "../../components/BookingList/BookingList";
import TableStatus from "../../components/TableStatus/TableStatus";
import "./Dashboard.css";

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        fetchBookings();
        fetchTables();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await fetch("API_URL_HERE/bookings");
            const data = await response.json();
            setBookings(data);
        } catch (error) {
            console.error("Error fetching bookings:", error);
        }
    };

    const fetchTables = async () => {
        try {
            const response = await fetch("API_URL_HERE/tables");
            const data = await response.json();
            setTables(data);
        } catch (error) {
            console.error("Error fetching tables:", error);
        }
    };

    const handleUpdateBooking = async (updatedBooking) => {
        try {
            const response = await fetch(`API_URL_HERE/bookings/${updatedBooking.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedBooking),
            });
            const updated = await response.json();
            setBookings(
                bookings.map((booking) =>
                    booking.id === updated.id ? updated : booking
                )
            );
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const handleDeleteBooking = async (id) => {
        try {
            await fetch(`API_URL_HERE/bookings/${id}`, {
                method: "DELETE",
            });
            setBookings(bookings.filter((booking) => booking.id !== id));
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

    return (
        <div className="app__dashboard">
            <h1>Restaurant Dashboard</h1>
            <BookingList
                bookings={bookings}
                onUpdateBooking={handleUpdateBooking}
                onDeleteBooking={handleDeleteBooking}
            />
            <TableStatus tables={tables} />
        </div>
    );
};

export default Dashboard;