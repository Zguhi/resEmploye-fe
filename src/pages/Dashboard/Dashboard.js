import React, { useState, useEffect } from "react";
import BookingList from "../../components/BookingList/BookingList";
import TableStatus from "../../components/TableStatus/TableStatus";
import "./Dashboard.css";

const Dashboard = () => {
    const [bookings, setBookings] = useState([]);
    const [tables, setTables] = useState([]);

    useEffect(() => {
        // Sử dụng dữ liệu tĩnh
        const mockBookings = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                date: "2023-06-20",
                time: "19:00",
                numGuests: 4,
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                date: "2023-06-22",
                time: "20:30",
                numGuests: 2,
            },
        ];

        const mockTables = [
            {
                id: 1,
                number: 1,
                status: "available",
            },
            {
                id: 2,
                number: 2,
                status: "occupied",
                order: ["Pizza", "Pasta"],
                date: "2023-06-20",
                time: "19:30",
            },
        ];

        setBookings(mockBookings);
        setTables(mockTables);

        console.log("Bookings after setting state:", mockBookings);
        console.log("Tables after setting state:", mockTables);
    }, []);

    const handleUpdateBooking = (updatedBooking) => {
        // Cập nhật đặt bàn trong danh sách
        const updatedList = bookings.map((booking) =>
            booking.id === updatedBooking.id ? updatedBooking : booking
        );
        setBookings(updatedList);
    };

    const handleDeleteBooking = (id) => {
        // Xóa đặt bàn khỏi danh sách
        const updatedList = bookings.filter((booking) => booking.id !== id);
        setBookings(updatedList);
    };

    console.log("Bookings before rendering BookingList:", bookings);
    console.log("Tables before rendering TableStatus:", tables);

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