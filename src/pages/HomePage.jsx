import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import ReservationService from '../api/ReservationService.js';
import BillsService from '../api/BillsService.js';

const HomePage = () => {
    const [todayStats, setTodayStats] = useState({
        reservations: 0,
        pendingReservations: 0,
        revenue: 0,
        totalOrders: 0
    });
    const [recentReservations, setRecentReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const today = new Date().toISOString().split('T')[0];

            // Lấy dữ liệu đặt bàn
            const reservationsResponse = await ReservationService.getAll();
            if (!reservationsResponse.data) {
                throw new Error('Không thể lấy dữ liệu đặt bàn');
            }

            const allReservations = reservationsResponse.data;

            // Lọc đặt bàn cho ngày hôm nay
            const todayReservations = allReservations.filter(res =>
                new Date(res.startTime).toISOString().split('T')[0] === today
            );

            // Lọc đặt bàn đang chờ xử lý
            const pendingReservations = allReservations.filter(res =>
                res.status === 'Pending'
            );

            // Lấy danh sách đơn hàng (bills)
            const ordersResponse = await BillsService.getAll();
            if (!ordersResponse.data) {
                throw new Error('Không thể lấy dữ liệu đơn hàng');
            }

            const allOrders = ordersResponse.data;

            // Tính tổng doanh thu của các đơn hàng hoàn thành hôm nay
            const todayOrders = allOrders.filter(order => {
                const orderDate = new Date(order.createdAt).toISOString().split('T')[0];
                return orderDate === today && order.orderStatus === 'Completed';
            });

            const todayRevenue = todayOrders.reduce((sum, order) => sum + order.totalPrice, 0);

            // Cập nhật state với tất cả dữ liệu
            setTodayStats({
                reservations: todayReservations.length,
                pendingReservations: pendingReservations.length,
                revenue: todayRevenue,
                totalOrders: todayOrders.length
            });

            // Lấy 5 đặt bàn gần nhất và sắp xếp theo thời gian
            const sortedReservations = [...allReservations]
                .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                .slice(0, 5);

            setRecentReservations(sortedReservations);
            setError(null);

        } catch (err) {
            console.error('Lỗi khi lấy dữ liệu dashboard:', err);
            setError('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const getStatusDisplay = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'Đã xác nhận';
            case 'Pending':
                return 'Chờ xác nhận';
            case 'Cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'Confirmed':
                return 'bg-green-100 text-green-800';
            case 'Pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="flex items-center justify-center min-h-screen">
                    <p className="text-gray-600">Đang tải dữ liệu...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-amber-700 mb-4">
                    Tổng quan Gericht Restaurant
                </h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        <p>{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {/* Số lượng đặt bàn */}
                    <div className="bg-amber-50 p-6 rounded-lg shadow-sm border border-amber-100">
                        <h2 className="text-lg font-bold text-amber-800 mb-3">Đặt bàn hôm nay</h2>
                        <p className="text-amber-700 text-2xl font-bold">
                            {todayStats.reservations}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">
                            {todayStats.pendingReservations} chờ xác nhận
                        </p>
                    </div>

                    {/* Doanh thu */}
                    <div className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-100">
                        <h2 className="text-lg font-bold text-green-800 mb-3">Doanh thu hôm nay</h2>
                        <p className="text-green-700 text-2xl font-bold">
                            {formatCurrency(todayStats.revenue)}
                        </p>
                    </div>

                    {/* Tổng đơn hàng */}
                    <div className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-100">
                        <h2 className="text-lg font-bold text-blue-800 mb-3">Tổng đơn hàng hôm nay</h2>
                        <p className="text-blue-700 text-2xl font-bold">
                            {todayStats.totalOrders}
                        </p>
                    </div>
                </div>

                {/* Đặt bàn gần đây */}
                <div className="mt-8">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Đặt bàn mới nhất</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Khách hàng
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số điện thoại
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Thời gian
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Số người
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Trạng thái
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                            {recentReservations.map((reservation) => (
                                <tr key={reservation.id || reservation.reservationId}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {reservation.guestName || reservation.customerName}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {reservation.guestPhone}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(reservation.startTime)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {reservation.numberOfGuests || reservation.numberOfPeople}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(reservation.status)}`}>
                                                {getStatusDisplay(reservation.status)}
                                            </span>
                                    </td>
                                </tr>
                            ))}
                            {recentReservations.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                        Không có đặt bàn mới
                                    </td>
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