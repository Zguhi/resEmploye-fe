import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import ReservationService from '../api/ReservationService.js';

// Sử dụng localStorage để lưu trữ ID đặt bàn đã thông báo
// Điều này giúp duy trì trạng thái giữa các lần refresh trang
const getNotifiedIds = () => {
    const saved = localStorage.getItem('notifiedReservationIds');
    return saved ? JSON.parse(saved) : [];
};

const saveNotifiedIds = (ids) => {
    localStorage.setItem('notifiedReservationIds', JSON.stringify(ids));
};

const ReservationNotification = () => {
    const [showNotification, setShowNotification] = useState(false);
    const [pendingCount, setPendingCount] = useState(0);
    const [newReservationIds, setNewReservationIds] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    // Chỉ chạy một lần khi component mount
    useEffect(() => {
        // Kiểm tra nếu không ở trang đặt bàn
        if (location.pathname !== '/reservation') {
            checkNewReservations();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Kiểm tra khi đường dẫn thay đổi
    useEffect(() => {
        // Nếu đang ở trang đặt bàn, ẩn thông báo
        if (location.pathname === '/reservation') {
            setShowNotification(false);
        }
    }, [location.pathname]);

    const checkNewReservations = async () => {
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

            // Nếu có đặt bàn chờ xác nhận
            if (pendingReservations.length > 0) {
                // Lấy các ID đặt bàn đang chờ
                const pendingIds = pendingReservations.map(res =>
                    res.id || res.reservationId
                );

                // Lấy danh sách ID đã thông báo trước đó
                const notifiedIds = getNotifiedIds();

                // Tìm các ID mới chưa được thông báo
                const newIds = pendingIds.filter(id => !notifiedIds.includes(id));

                // Nếu có đặt bàn mới
                if (newIds.length > 0) {
                    setPendingCount(pendingReservations.length);
                    setNewReservationIds(newIds);
                    setShowNotification(true);

                    // Lưu các ID đã thông báo
                    saveNotifiedIds([...notifiedIds, ...newIds]);
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

    // Đóng thông báo và ghi nhớ rằng đã thấy thông báo này
    const handleDismiss = () => {
        setShowNotification(false);
    };

    // Không hiển thị nếu không có thông báo hoặc đang ở trang đặt bàn
    if (!showNotification || location.pathname === '/reservation' || newReservationIds.length === 0) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
                <h3 className="text-xl font-semibold text-amber-700 mb-3">Thông báo đặt bàn mới</h3>
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