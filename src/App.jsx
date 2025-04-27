import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from "react-router-dom";
import LoginForm from "./pages/LoginForm";
import HomePage from "./pages/HomePage.jsx";
import MenuPage from "./pages/MenuPage.jsx";
import ReservationPage from "./pages/ReservationPage.jsx";
import StaffPage from "./pages/StaffPage.jsx";
import InventoryPage from "./pages/InventoryPage.jsx";
import BillsPage from "./pages/BillsPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import ReservationNotification from "./pages/ReservationNotification.jsx"; // Đã cập nhật đường dẫn
import './App.css'

function App() {
    // Kiểm tra xem có đang ở trang login hay không
    const location = useLocation();
    const isLoginPage = location.pathname === "/";

    return (
        <div className="flex">
            {/* Chỉ hiện sidebar khi không phải trang login */}
            {!isLoginPage && <Sidebar />}

            <main className={!isLoginPage ? "flex-1 ml-64 p-6" : "flex-1"}>
                {/* Hiển thị thông báo đặt bàn chỉ khi đã đăng nhập */}
                {!isLoginPage && <ReservationNotification />}

                <Routes>
                    {/* Trang đăng nhập là route mặc định */}
                    <Route path="/" element={<LoginForm />} />

                    {/* Kích hoạt ProtectedRoute cho tất cả các trang */}
                    <Route path="/home" element={
                        <ProtectedRoute>
                            <HomePage />
                        </ProtectedRoute>
                    } />

                    <Route path="/menu" element={
                        <ProtectedRoute>
                            <MenuPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/reservation" element={
                        <ProtectedRoute>
                            <ReservationPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/staff" element={
                        <ProtectedRoute>
                            <StaffPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/inventory" element={
                        <ProtectedRoute>
                            <InventoryPage />
                        </ProtectedRoute>
                    } />

                    <Route path="/bills" element={
                        <ProtectedRoute>
                            <BillsPage />
                        </ProtectedRoute>
                    } />
                </Routes>
            </main>
        </div>
    );
}

// Wrapper component để sử dụng useLocation
function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;