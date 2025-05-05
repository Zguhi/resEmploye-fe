import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import { getCurrentUser } from '../api/auth.js';
import ReservationService from '../api/ReservationService.js';
import BillsService from '../api/BillsService.js';

const HomePage = () => {
    const [user, setUser] = useState(null);
    const [reservationsToday, setReservationsToday] = useState(0);
    const [pendingReservations, setPendingReservations] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [recentReservations, setRecentReservations] = useState([]);
    const [todayOrders, setTodayOrders] = useState(0);
    const [processingOrders, setProcessingOrders] = useState(0);

    useEffect(() => {
        const userInfo = getCurrentUser();
        setUser(userInfo);

        fetchTodayReservations();
        fetchTodayRevenue();
        fetchRecentReservations();
        fetchTodayOrders();
    }, []);

    const fetchTodayReservations = async () => {
        try {
            const response = await ReservationService.getAll();
            const today = new Date().toISOString().split('T')[0];

            const todayReservations = response.data.filter(res =>
                new Date(res.startTime).toISOString().split('T')[0] === today
            );

            const pendingReservations = todayReservations.filter(res => res.status === 'Pending');

            setReservationsToday(todayReservations.length);
            setPendingReservations(pendingReservations.length);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đặt bàn:', error);
        }
    };

    const fetchTodayRevenue = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];
            const response = await BillsService.getRevenue(today, today);
            setTodayRevenue(response.data.data.totalRevenue || 0);
        } catch (error) {
            console.error('Lỗi khi lấy doanh thu:', error);
        }
    };

    const fetchRecentReservations = async () => {
        try {
            const response = await ReservationService.getAll();
            const sortedReservations = response.data
                .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                .slice(0, 3);
            setRecentReservations(sortedReservations);
        } catch (error) {
            console.error('Lỗi khi lấy đặt bàn mới nhất:', error);
        }
    };

    const fetchTodayOrders = async () => {
        try {
            const response = await BillsService.getAll();
            const today = new Date().toISOString().split('T')[0];

            const todayOrders = response.data.filter(order =>
                new Date(order.created_at).toISOString().split('T')[0] === today
            );

            const processingOrders = todayOrders.filter(order =>
                ['Pending', 'Preparing', 'Delivering'].includes(order.order_status)
            );

            setTodayOrders(todayOrders.length);
            setProcessingOrders(processingOrders.length);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đơn hàng:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit'
        });
    };

    return (
        <Layout>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-amber-700 mb-4">Chào mừng đến với Quản lý Gericht Restaurant</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100">
                        <h2 className="text-lg font-bold text-amber-800 mb-3">Đặt bàn hôm nay</h2>
                        <p className="text-amber-700 text-2xl font-bold">{reservationsToday}</p>
                        <p className="text-gray-600 text-sm mt-1">{pendingReservations} chờ xác nhận</p>
                    </div>

                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                        <h2 className="text-lg font-bold text-green-800 mb-3">Doanh thu hôm nay</h2>
                        <p className="text-green-700 text-2xl font-bold">{formatCurrency(todayRevenue)}</p>
                        <p className="text-gray-600 text-sm mt-1">So với hôm qua</p>
                    </div>

                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-800 mb-3">Tổng đơn hàng</h2>
                        <p className="text-blue-700 text-2xl font-bold">{todayOrders}</p>
                        <p className="text-gray-600 text-sm mt-1">{processingOrders} đang xử lý</p>
                    </div>
                </div>

                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Đặt bàn mới nhất</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100">
                            <tr>
                                <th className="py-2 px-4 text-left">Khách hàng</th>
                                <th className="py-2 px-4 text-left">Số điện thoại</th>
                                <th className="py-2 px-4 text-left">Thời gian</th>
                                <th className="py-2 px-4 text-left">Số người</th>
                                <th className="py-2 px-4 text-left">Trạng thái</th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {recentReservations.length > 0 ? (
                                recentReservations.map((reservation) => (
                                    <tr key={reservation.id || reservation.reservationId}>
                                        <td className="py-2 px-4">{reservation.guestName || reservation.customerName}</td>
                                        <td className="py-2 px-4">{reservation.guestPhone}</td>
                                        <td className="py-2 px-4">{formatDate(reservation.startTime)}</td>
                                        <td className="py-2 px-4">{reservation.numberOfGuests}</td>
                                        <td className="py-2 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs ${
                                                reservation.status === 'Confirmed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : reservation.status === 'Pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-red-100 text-red-800'
                                            }`}>
                                                {reservation.status === 'Confirmed'
                                                    ? 'Đã xác nhận'
                                                    : reservation.status === 'Pending'
                                                        ? 'Chờ xác nhận'
                                                        : 'Đã hủy'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center py-4">Không có đặt bàn mới</td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default HomePage;