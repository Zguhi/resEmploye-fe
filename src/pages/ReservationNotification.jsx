import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReservationService from '../api/ReservationService.js';

const ReservationNotification = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [notifiedIds, setNotifiedIds] = useState([]); // Lưu trữ ID các đặt bàn đã thông báo
    const navigate = useNavigate();

    useEffect(() => {
        // Kiểm tra đặt bàn khi component được tải
        checkPendingReservations();

        // Thiết lập kiểm tra định kỳ cho các đặt bàn mới
        const checkInterval = setInterval(() => {
            checkPendingReservations();
        }, 60000); // Kiểm tra mỗi phút

        return () => clearInterval(checkInterval);
    }, []);

    const checkPendingReservations = async () => {
        try {
            const response = await ReservationService.getAll();

            // Xử lý dữ liệu
            const data = response.data;
            const reservationList = Array.isArray(data) ? data :
                (data.content || data.data || []);

            // Lọc các đặt bàn đang chờ xác nhận
            const pendingReservations = reservationList.filter(
                reservation => reservation.status === 'Pending'
            );

            // Kiểm tra xem có đặt bàn chờ xác nhận mới không
            if (pendingReservations.length > 0) {
                // Lấy danh sách ID của các đặt bàn đang chờ xác nhận
                const pendingIds = pendingReservations.map(res => res.id || res.reservationId);

                // Lọc ra các ID chưa được thông báo trước đó
                const newPendingIds = pendingIds.filter(id => !notifiedIds.includes(id));

                // Nếu có đặt bàn mới chưa thông báo
                if (newPendingIds.length > 0) {
                    setPendingCount(pendingReservations.length);
                    setShowNotification(true);

                    // Lưu các ID đã thông báo
                    setNotifiedIds(prev => [...prev, ...newPendingIds]);
                }
            }
        } catch (error) {
            console.error('Lỗi khi kiểm tra đặt bàn:', error);
        }
    };

    const handleViewReservations = () => {
        setShowNotification(false);
        navigate('/reservation');
    };

    if (!showNotification) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">Thông báo đặt bàn mới</h3>
                <p className="mb-5">Có {pendingCount} đặt bàn đang chờ xác nhận!</p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowNotification(false)}
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