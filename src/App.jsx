import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import ReservationPage from "./pages/ReservationPage.jsx";
// import InventoryPage from "./pages/InventoryPage.jsx";
import BillsPage from "./pages/BillsPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ReservationNotification from "./pages/ReservationNotification.jsx";
import './App.css'

function App() {
    return (
        <div className="flex">
            <Sidebar />
            <main className="flex-1 ml-64 p-6">
                <ReservationNotification />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/home" element={<HomePage />} />
                    <Route path="/menu" element={<MenuPage />} />
                    <Route path="/reservation" element={<ReservationPage />} />
                    {/*<Route path="/inventory" element={<InventoryPage />} />*/}
                    <Route path="/bills" element={<BillsPage />} />
                </Routes>
            </main>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;