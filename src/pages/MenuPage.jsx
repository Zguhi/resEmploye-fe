import React, { useState, useEffect } from 'react';
import Layout from '../layouts/layout.jsx';
import ReservationService from '../api/ReservationService.js';

const ReservationPage = () => {
    const [reservations, setReservations] = useState([]);
    const [newReservation, setNewReservation] = useState({
        customerName: '',
        phone: '',
        email: '',
        date: '',
        time: '',
        guestCount: 1,
        tableNumber: '',
        status: 'pending',
        notes: ''
    });
    const [editReservation, setEditReservation] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const statusOptions = ['pending', 'confirmed', 'cancelled'];

    useEffect(() => {
        fetchReservations();
    }, [page]);

    // Lấy danh sách đặt bàn
    const fetchReservations = async () => {
        try {
            const response = await ReservationService.getAll(page, 10, 'id', 'asc');
            const data = response.data.data;
            setReservations(data.content);
            setTotalPages(data.totalPages);
        } catch (error) {
            console.error('Lỗi khi lấy danh sách đặt bàn:', error);
        }
    };

    // Thêm đặt bàn mới
    const handleAddReservation = async () => {
        if (newReservation.customerName.trim() === '' || newReservation.phone.trim() === '' || !newReservation.date || !newReservation.time) {
            alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
            return;
        }

        try {
            await ReservationService.add(newReservation);
            setNewReservation({
                customerName: '',
                phone: '',
                email: '',
                date: '',
                time: '',
                guestCount: 1,
                tableNumber: '',
                status: 'pending',
                notes: ''
            });
            fetchReservations();
            setIsModalOpen(false);
        } catch (err) {
            console.error('Lỗi khi thêm đặt bàn:', err);
        }
    };

    // Cập nhật đặt bàn
    const handleUpdate = async () => {
        if (!editReservation.customerName.trim() || !editReservation.phone.trim()) return;

        try {
            const response = await ReservationService.update(editReservation);

            if (response.status === 200) {
                console.log('Cập nhật thành công:', response.data);
                setEditReservation(null);
                fetchReservations();
            } else {
                console.error('Cập nhật không thành công:', response);
            }
        } catch (err) {
            console.error('Lỗi khi cập nhật đặt bàn:', err);
        }
    };

    // Xác nhận đặt bàn
    const handleConfirm = async (id) => {
        try {
            await ReservationService.confirmReservation(id);
            fetchReservations();
        } catch (err) {
            console.error('Lỗi khi xác nhận đặt bàn:', err);
        }
    };

    // Hủy đặt bàn
    const handleCancel = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn hủy đặt bàn này?')) {
            try {
                await ReservationService.cancelReservation(id);
                fetchReservations();
            } catch (err) {
                console.error('Lỗi khi hủy đặt bàn:', err);
            }
        }
    };

    // Xóa đặt bàn
    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa đặt bàn này?')) {
            try {
                await ReservationService.delete(id);
                fetchReservations();
            } catch (err) {
                console.error('Lỗi khi xóa đặt bàn:', err);
            }
        }
    };

    // Chỉnh sửa đặt bàn
    const handleEdit = (reservation) => {
        setEditReservation({ ...reservation });
    };

    // Định dạng ngày tháng
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString('vi-VN', options);
    };

    // Lấy trạng thái hiển thị
    const getStatusDisplay = (status) => {
        switch(status) {
            case 'pending': return 'Chờ xác nhận';
            case 'confirmed': return 'Đã xác nhận';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    // Lấy màu hiển thị trạng thái
    const getStatusColor = (status) => {
        switch(status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'confirmed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <Layout>
            <h2 className="text-2xl font-bold mb-4 text-amber-700">Quản lý Đặt bàn</h2>

            {/* Nút thêm đặt bàn, mở Modal */}
            <button
                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                onClick={() => setIsModalOpen(true)}
            >
                Thêm Đặt bàn
            </button>

            {/* Modal Thêm Đặt bàn */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-semibold mb-4 text-amber-700">Thêm Đặt bàn mới</h3>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tên khách hàng <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Tên khách hàng"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.customerName}
                                    onChange={(e) => setNewReservation({ ...newReservation, customerName: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số điện thoại <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    placeholder="Số điện thoại"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.phone}
                                    onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.email}
                                    onChange={(e) => setNewReservation({ ...newReservation, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ngày <span className="text-red-500">*</span></label>
                                <input
                                    type="date"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.date}
                                    onChange={(e) => setNewReservation({ ...newReservation, date: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Giờ <span className="text-red-500">*</span></label>
                                <input
                                    type="time"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.time}
                                    onChange={(e) => setNewReservation({ ...newReservation, time: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số khách</label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="Số khách"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.guestCount}
                                    onChange={(e) => setNewReservation({ ...newReservation, guestCount: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Số bàn</label>
                                <input
                                    type="number"
                                    placeholder="Số bàn"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.tableNumber}
                                    onChange={(e) => setNewReservation({ ...newReservation, tableNumber: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Ghi chú</label>
                                <textarea
                                    placeholder="Ghi chú"
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    value={newReservation.notes}
                                    onChange={(e) => setNewReservation({ ...newReservation, notes: e.target.value })}
                                    rows="3"
                                />
                            </div>
                        </div>

                        <div className="flex gap-2 justify-end mt-4">
                            <button
                                className="bg-amber-600 text-white px-4 py-2 rounded hover:bg-amber-700"
                                onClick={handleAddReservation}
                            >
                                Thêm
                            </button>
                            <button
                                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                                onClick={() => setIsModalOpen(false)}
                            >
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Bảng danh sách đặt bàn */}
            <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead>
                    <tr className="bg-amber-50 text-left">
                        <th className="border px-4 py-2">ID</th>
                        <th className="border px-4 py-2">Khách hàng</th>
                        <th className="border px-4 py-2">SĐT</th>
                        <th className="border px-4 py-2">Ngày</th>
                        <th className="border px-4 py-2">Giờ</th>
                        <th className="border px-4 py-2">Số khách</th>
                        <th className="border px-4 py-2">Bàn</th>
                        <th className="border px-4 py-2">Trạng thái</th>
                        <th className="border px-4 py-2">Hành động</th>
                    </tr>
                    </thead>
                    <tbody>
                    {reservations.map((reservation) => (
                        <tr key={reservation.id}>
                            <td className="border px-4 py-2">{reservation.id}</td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        value={editReservation.customerName}
                                        onChange={(e) => setEditReservation({ ...editReservation, customerName: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    reservation.customerName
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        value={editReservation.phone}
                                        onChange={(e) => setEditReservation({ ...editReservation, phone: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    reservation.phone
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        type="date"
                                        value={editReservation.date}
                                        onChange={(e) => setEditReservation({ ...editReservation, date: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    formatDate(reservation.date)
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        type="time"
                                        value={editReservation.time}
                                        onChange={(e) => setEditReservation({ ...editReservation, time: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    reservation.time
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        type="number"
                                        min="1"
                                        value={editReservation.guestCount}
                                        onChange={(e) => setEditReservation({ ...editReservation, guestCount: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    reservation.guestCount
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <input
                                        type="number"
                                        value={editReservation.tableNumber || ''}
                                        onChange={(e) => setEditReservation({ ...editReservation, tableNumber: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    />
                                ) : (
                                    reservation.tableNumber || '-'
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <select
                                        value={editReservation.status}
                                        onChange={(e) => setEditReservation({ ...editReservation, status: e.target.value })}
                                        className="border p-1 rounded w-full"
                                    >
                                        {statusOptions.map(status => (
                                            <option key={status} value={status}>{getStatusDisplay(status)}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(reservation.status)}`}>
                      {getStatusDisplay(reservation.status)}
                    </span>
                                )}
                            </td>
                            <td className="border px-4 py-2">
                                {editReservation?.id === reservation.id ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleUpdate}
                                            className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                        >
                                            Lưu
                                        </button>
                                        <button
                                            onClick={() => setEditReservation(null)}
                                            className="bg-gray-400 text-white px-2 py-1 rounded hover:bg-gray-500"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 flex-wrap">
                                        <button
                                            onClick={() => handleEdit(reservation)}
                                            className="bg-amber-500 text-white px-2 py-1 rounded hover:bg-amber-600"
                                        >
                                            Sửa
                                        </button>

                                        {reservation.status === 'pending' && (
                                            <button
                                                onClick={() => handleConfirm(reservation.id)}
                                                className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600"
                                            >
                                                Xác nhận
                                            </button>
                                        )}

                                        {reservation.status !== 'cancelled' && (
                                            <button
                                                onClick={() => handleCancel(reservation.id)}
                                                className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                            >
                                                Hủy
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(reservation.id)}
                                            className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Phân trang */}
            <div className="flex justify-center mt-4 gap-2">
                <button
                    onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                    disabled={page === 0}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Trước
                </button>
                <span className="px-3 py-1">
          {page + 1} / {totalPages}
        </span>
                <button
                    onClick={() => setPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={page + 1 >= totalPages}
                    className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                >
                    Sau
                </button>
            </div>
        </Layout>
    );
};

export default ReservationPage;