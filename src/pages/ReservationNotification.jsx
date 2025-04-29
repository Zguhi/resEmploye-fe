import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReservationService from '../api/ReservationService.js';

const ReservationNotification = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const navigate = useNavigate();
    const location = useLocation();
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Nếu đã từng bấm "Để sau" hoặc đang ở trang reservation thì không hiện thông báo
        if (dismissed || location.pathname === '/reservation') {
            return;
        }

        const checkReservations = async () => {
            try {
                const response = await ReservationService.getAll();
                const reservations = response.data;

                // Lọc các đặt bàn đang chờ xác nhận
                const pendingReservations = reservations.filter(
                    res => res.status === 'Pending'
                );

                if (pendingReservations.length > 0) {
                    setPendingCount(pendingReservations.length);
                    setShowNotification(true);
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra đặt bàn:', error);
            }
        };

        checkReservations();
    }, [location.pathname, dismissed]);

    const handleViewReservations = () => {
        setShowNotification(false);
        navigate('/reservation');
    };

    const handleDismiss = () => {
        setDismissed(true);
        setShowNotification(false);
    };

    if (!showNotification) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">
                    Thông báo đặt bàn mới
                </h3>
                <p className="mb-5">Có {pendingCount} đặt bàn đang chờ xác nhận!</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={handleDismiss}
                        className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
                    >
                        Để sau
                    </button>
                    <button
                        onClick={handleViewReservations}
                        className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
                    >
                        Xem ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReservationNotification;